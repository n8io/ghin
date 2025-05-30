import { Mutex } from 'async-mutex'
import { type JwtPayload, jwtDecode } from 'jwt-decode'
import type { ZodSchema } from 'zod'
import {
  type AccessToken,
  type ClientConfig,
  type LoginResponse,
  type SessionResponse,
  schemaClientConfig,
  schemaLoginResponse,
  schemaSessionResponse,
} from './models'

const FIREBASE_SESSION_URL = new URL(
  'https://firebaseinstallations.googleapis.com/v1/projects/ghin-mobile-app/installations'
)

const GOOGLE_API_KEY = 'AIzaSyBxgTOAWxiud0HuaE5tN-5NTlzFnrtyz-I' as const

const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36' as const

const CLIENT_SOURCE = 'GHINcom'

const SESSION_DEFAULTS = {
  appId: '1:884417644529:web:47fb315bc6c70242f72650',
  authVersion: 'FIS_v2',
  fid: 'fg6JfS0U01YmrelthLX9Iz',
  sdkVersion: 'w:0.5.7',
} as const

const FETCH_HEADER_DEFAULTS: RequestInit['headers'] = {
  'Content-Type': 'application/json',
  'User-Agent': DEFAULT_USER_AGENT,
}

const apiPathnames = {
  course_countries: '/get_countries_and_states.json',
  course_details: '/crsCourseMethods.asmx/GetCourseDetails.json',
  course_handicaps: '/playing_handicaps.json',
  course_search: '/crsCourseMethods.asmx/SearchCourses.json',
  golfer: '/search_golfer.json',
  golfers_search: '/golfers.json',
  login: '/golfer_login.json',
  scores: '/scores.json',
} as const

type Entity = Exclude<keyof typeof apiPathnames, 'login'>

type FetchParameters = {
  entity: Entity
  schema: ZodSchema
  options?: RequestInit & {
    searchParams?: URLSearchParams
  }
}

const toFullApiUrl = (baseUrl: URL, pathname: keyof typeof apiPathnames): URL =>
  new URL(`${baseUrl.pathname}${apiPathnames[pathname]}`, baseUrl)

const makeAuthHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
})

class RequestClient {
  private accessToken: string | undefined
  private apiVersion = 'v1'
  private config: ClientConfig
  private baseUrl = new URL(`https://api2.ghin.com/api/${this.apiVersion}`)
  private lock: Mutex
  private sessionToken: AccessToken | undefined

  constructor(config: ClientConfig) {
    const results = schemaClientConfig.safeParse(config)

    if (!results.success) {
      throw new Error(`Invalid RequestClientConfig: ${results.error.message}`)
    }

    this.lock = new Mutex()
    this.config = schemaClientConfig.parse(results.data)
  }

  private async _fetch<T>({
    options,
    schema,
    url,
  }: {
    options: RequestInit
    schema: ZodSchema
    url: URL
  }): Promise<T> {
    const response = await fetch(url.toString(), options)

    if (!response.ok || response.status >= 400) {
      const body = await response.json()

      throw new Error(
        `${options.method?.toUpperCase() ?? 'GET'} request failed: ${response.status} ${
          response.statusText
        } / ${url.toString()} / ${JSON.stringify(body)}`
      )
    }

    const raw = await response.json()
    const parsed = schema.safeParse(raw)

    if (!parsed.success) {
      throw new Error(
        `${options.method?.toUpperCase() ?? 'GET'} response failed to parse: ${JSON.stringify(
          parsed.error
        )} / ${url.toString()}`
      )
    }

    return parsed.data
  }

  private async refreshSessionToken(): Promise<AccessToken> {
    const url = new URL(FIREBASE_SESSION_URL)
    const body = JSON.stringify(SESSION_DEFAULTS)

    const { authToken: accessToken } = await this._fetch<SessionResponse>({
      options: {
        body,
        headers: {
          ...FETCH_HEADER_DEFAULTS,
          'x-goog-api-key': GOOGLE_API_KEY,
        },
        method: 'POST',
      },
      schema: schemaSessionResponse,
      url,
    })

    return accessToken
  }

  private isAccessTokenValid(accessToken?: string): boolean {
    if (!accessToken) {
      return false
    }

    const decoded = jwtDecode<Pick<JwtPayload, 'exp'>>(accessToken)
    const expirationDate = new Date((decoded.exp as number) * 1_000)

    return expirationDate > new Date()
  }

  private async getAccessToken(): Promise<string> {
    const isAccessTokenValid = this.isAccessTokenValid(this.accessToken)

    if (isAccessTokenValid) {
      return this.accessToken as string
    }

    const cachedAccessToken = await this.config.cache.read()
    const isCachedTokenValid = this.isAccessTokenValid(cachedAccessToken)

    if (isCachedTokenValid) {
      this.accessToken = cachedAccessToken

      return cachedAccessToken as string
    }

    const accessToken = await this.refreshAccessToken()

    this.accessToken = accessToken

    await this.config.cache.write(accessToken)

    return accessToken
  }

  private async refreshAccessToken(): Promise<string> {
    this.sessionToken = await this.refreshSessionToken()

    const url = toFullApiUrl(this.baseUrl, 'login')

    const body = JSON.stringify({
      token: this.sessionToken.token,
      user: {
        email_or_ghin: this.config.username,
        password: this.config.password,
      },
    })

    const response = await this._fetch<LoginResponse>({
      options: {
        body,
        headers: FETCH_HEADER_DEFAULTS,
        method: 'POST',
      },
      schema: schemaLoginResponse,
      url,
    })

    return response?.golfer_user?.golfer_user_token
  }

  async fetch<RequestReturnType>({ entity, schema, options = {} }: FetchParameters): Promise<RequestReturnType> {
    const accessToken = await this.lock.runExclusive(async () => this.getAccessToken())
    const url = toFullApiUrl(this.baseUrl, entity)
    const { headers, searchParams, ...requestInitOptions } = options

    const actualOptions = {
      ...requestInitOptions,
      headers: { ...FETCH_HEADER_DEFAULTS, source: CLIENT_SOURCE, ...makeAuthHeaders(accessToken), ...headers },
    }

    if (searchParams) {
      url.search = searchParams.toString()
    }

    return this._fetch<RequestReturnType>({ options: actualOptions, schema, url })
  }
}

export { CLIENT_SOURCE, RequestClient }
