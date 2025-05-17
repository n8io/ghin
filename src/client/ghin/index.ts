import { z } from 'zod'
import { type ClientConfig, number, schemaClientConfig } from '../../models'
import { InMemoryCacheClient } from '../in-memory-cache-client'
import { CLIENT_SOURCE, RequestClient } from '../request-client'
import {
  type CourseCountriesResponse,
  type CourseCountry,
  type CourseDetailsRequest,
  type CourseDetailsResponse,
  type CourseHandicapsRequest,
  type CoursePlayerHandicapsResponse,
  type CourseSearchRequest,
  type CourseSearchResponse,
  type GolferCourseHandicapRequest,
  type GolferSearchRequest,
  type GolferSearchResponse,
  type HandicapResponse,
  type ScoresRequest,
  type ScoresResponse,
  schemaCourseCountriesResponse,
  schemaCourseDetailsRequest,
  schemaCourseDetailsResponse,
  schemaCoursePlayerHandicapsResponse,
  schemaCourseSearchRequest,
  schemaCourseSearchResponse,
  schemaGolferCourseHandicapRequest,
  schemaGolferHandicapResponse,
  schemaGolferSearchRequest,
  schemaGolferSearchResponse,
  schemaScoresRequest,
  schemaScoresResponse,
} from './models'

const searchParameters = {
  GOLFER_ID: 'golfer_id',
  SOURCE: 'source',
} as const

class GhinClient {
  private httpClient: RequestClient

  courses: {
    getCountries: () => Promise<CourseCountry[]>
    getDetails: (request: CourseDetailsRequest) => Promise<CourseDetailsResponse>
    search: (request: CourseSearchRequest) => Promise<CourseSearchResponse['courses']>
  }

  golfers: {
    getOne: (ghinNumber: number) => Promise<GolferSearchResponse['golfers'][number] | undefined>
    getScores: (ghinNumber: number, request?: ScoresRequest) => Promise<ScoresResponse>
    search: (request: GolferSearchRequest) => Promise<GolferSearchResponse['golfers']>
  }

  handicaps: {
    getOne: (ghinNumber: number) => Promise<HandicapResponse['golfer']>
    getCoursePlayerHandicaps: (requests: GolferCourseHandicapRequest[]) => Promise<CoursePlayerHandicapsResponse>
  }

  constructor(config: ClientConfig) {
    const results = schemaClientConfig.safeParse(config)

    if (!results.success) {
      throw new Error(`Invalid GhinClientConfig: ${results.error.message}`)
    }

    this.httpClient = new RequestClient({
      ...results.data,
      cache: results.data.cache ?? new InMemoryCacheClient(),
    })

    this.courses = {
      getCountries: this.coursesGetCountries.bind(this),
      getDetails: this.courseGetDetails.bind(this),
      search: this.courseSearch.bind(this),
    }

    this.handicaps = {
      getOne: this.handicapsGetOne.bind(this),
      getCoursePlayerHandicaps: this.handicapsGetCoursePlayerHandicaps.bind(this),
    }

    this.golfers = {
      getOne: this.golfersGetOne.bind(this),
      getScores: this.golfersGetScores.bind(this),
      search: this.golfersSearch.bind(this),
    }
  }

  private async coursesGetCountries(): Promise<CourseCountry[]> {
    const searchParams = new URLSearchParams([['source', CLIENT_SOURCE]])
    const options: Parameters<typeof this.httpClient.fetch>[0]['options'] = { searchParams }

    const { countries } = await this.httpClient.fetch<CourseCountriesResponse>({
      entity: 'course_countries',
      options,
      schema: schemaCourseCountriesResponse,
    })

    return countries
  }

  private async courseGetDetails(request: CourseDetailsRequest): Promise<CourseDetailsResponse> {
    const validRequest = schemaCourseDetailsRequest.parse(request)
    const searchParams = new URLSearchParams([['source', CLIENT_SOURCE]])

    for (const [key, value] of Object.entries(validRequest)) {
      searchParams.set(key, value.toString())
    }

    const options: Parameters<typeof this.httpClient.fetch>[0]['options'] = { searchParams }

    return this.httpClient.fetch<CourseDetailsResponse>({
      entity: 'course_details',
      options,
      schema: schemaCourseDetailsResponse,
    })
  }

  private async courseSearch(request: CourseSearchRequest): Promise<CourseSearchResponse['courses']> {
    const validRequest = schemaCourseSearchRequest.parse(request)
    const searchParams = new URLSearchParams([['source', CLIENT_SOURCE]])

    for (const [key, value] of Object.entries(validRequest)) {
      searchParams.set(key, value.toString())
    }

    const options: Parameters<typeof this.httpClient.fetch>[0]['options'] = { searchParams }

    const { courses } = await this.httpClient.fetch<CourseSearchResponse>({
      entity: 'course_search',
      options,
      schema: schemaCourseSearchResponse,
    })

    return courses
  }

  private async handicapsGetOne(ghin: number): Promise<HandicapResponse['golfer']> {
    const ghinNumber = number.parse(ghin)

    const searchParams = new URLSearchParams([
      ['source', CLIENT_SOURCE],
      ['ghin', ghinNumber.toString()],
    ])

    const options: Parameters<typeof this.httpClient.fetch>[0]['options'] = {
      searchParams,
    }

    const { golfer } = await this.httpClient.fetch<HandicapResponse>({
      entity: 'golfer',
      options,
      schema: schemaGolferHandicapResponse,
    })

    return golfer
  }

  private async handicapsGetCoursePlayerHandicaps(
    request: GolferCourseHandicapRequest[]
  ): Promise<CoursePlayerHandicapsResponse> {
    const golfers = z
      .array(schemaGolferCourseHandicapRequest)
      .parse(request)
      .map(({ ghin, ...golfer }) => ({
        ...golfer,
        [searchParameters.GOLFER_ID]: ghin,
      }))

    const searchParams = new URLSearchParams()

    const courseHandicapRequest: CourseHandicapsRequest = {
      golfers,
      source: CLIENT_SOURCE,
    }

    const options: Parameters<typeof this.httpClient.fetch>[0]['options'] = {
      body: JSON.stringify(courseHandicapRequest),
      method: 'POST',
      searchParams,
    }

    return this.httpClient.fetch<CoursePlayerHandicapsResponse>({
      entity: 'course_handicaps',
      options,
      schema: schemaCoursePlayerHandicapsResponse,
    })
  }

  private async golfersSearch(request: GolferSearchRequest): Promise<GolferSearchResponse['golfers']> {
    const { ghin, ...params } = schemaGolferSearchRequest.parse(request)
    const searchParams = new URLSearchParams([['source', CLIENT_SOURCE]])

    const searchDefaults = {
      from_ghin: true,
      per_page: 25,
      sorting_criteria: 'full_name',
      order: 'asc',
      page: 1,
    }

    for (const [key, value] of Object.entries(searchDefaults)) {
      searchParams.set(key, value.toString())
    }

    if (ghin) {
      searchParams.set(searchParameters.GOLFER_ID, ghin.toString())
    }

    const options: Parameters<typeof this.httpClient.fetch>[0]['options'] = {
      searchParams,
    }

    const { golfers } = await this.httpClient.fetch<GolferSearchResponse>({
      entity: 'golfers_search',
      schema: schemaGolferSearchResponse,
      options,
    })

    return golfers
  }

  private async golfersGetOne(ghinNumber: number): Promise<GolferSearchResponse['golfers'][number] | undefined> {
    const ghin = number.parse(ghinNumber)
    const results = await this.golfersSearch({ ghin: ghin, status: 'Active' })

    return results.find((golfer) => golfer.status === 'Active')
  }

  private async golfersGetScores(ghinNumber: number, request?: ScoresRequest): Promise<ScoresResponse> {
    const validRequest = schemaScoresRequest.parse(request) ?? {}
    const ghin = number.parse(ghinNumber)

    const searchParams = new URLSearchParams([
      [searchParameters.GOLFER_ID, ghin.toString()],
      ['source', CLIENT_SOURCE],
    ])

    for (const [key, value] of Object.entries(validRequest)) {
      if (value === null) {
        continue
      }

      if (Array.isArray(value)) {
        for (const v of value) {
          searchParams.append(key, v.toString())
        }
        continue
      }

      if (typeof value === 'object' && value instanceof Date) {
        searchParams.set(key, value.toISOString().split('T')[0] as string)
        continue
      }

      searchParams.set(key, value.toString())
    }

    const options: Parameters<typeof this.httpClient.fetch>[0]['options'] = {
      searchParams,
    }

    const response = await this.httpClient.fetch<ScoresResponse>({
      entity: 'scores',
      options,
      schema: schemaScoresResponse,
    })

    return response
  }
}

export { GhinClient }
