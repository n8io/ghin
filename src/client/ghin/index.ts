import { z } from "zod";
import { number } from "../../models";
import { GolferSearchRequest, GolferSearchResponse, HandicapResponse, ScoresResponse, ScoresRequest, schemaGolferSearchRequest, schemaGolferSearchResponse, schemaGolferHandicapResponse, schemaScoresResponse, schemaScoresRequest, CoursePlayerHandicapsResponse, CourseHandicapsRequest, schemaCourseHandicapsRequest, GolferCourseHandicapRequest, schemaGolferCourseHandicapRequest, schemaCoursePlayerHandicapsResponse, ClientConfig, schemaClientConfig } from "./models";
import { CLIENT_SOURCE, RequestClient } from "../request-client";

const searchParameters = {
  GOLFER_ID: 'golfer_id',
} as const

class GhinClient {
  private httpClient: RequestClient

  public handicaps: {
    getOne: (ghinNumber: number) => Promise<HandicapResponse['golfer']>
    getCoursePlayerHandicaps: (requests: GolferCourseHandicapRequest[]) => Promise<CoursePlayerHandicapsResponse>
  }

  public golfers: {
    getOne: (ghinNumber: number) => Promise<GolferSearchResponse['golfers'][number] | undefined> 
    getScores: (ghinNumber: number, request?: ScoresRequest) => Promise<ScoresResponse>
    search: (request: GolferSearchRequest) => Promise<GolferSearchResponse['golfers']>
  }

  constructor(config: ClientConfig) {
    const results = schemaClientConfig.safeParse(config)

    if (!results.success) {
      throw new Error(`Invalid GhinClientConfig: ${results.error.message}`)
    }

    this.httpClient = new RequestClient(results.data)
    
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

  async handicapsGetOne(ghin: number): Promise<HandicapResponse['golfer']> {
    const ghinNumber = number.parse(ghin)
    const searchParams = new URLSearchParams()

    searchParams.set(searchParameters.GOLFER_ID, ghinNumber.toString())

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

  async handicapsGetCoursePlayerHandicaps(request: GolferCourseHandicapRequest[]): Promise<CoursePlayerHandicapsResponse> {
    const golfers = z.array(schemaGolferCourseHandicapRequest).parse(request).map(({ ghin, ...golfer }) => ({
      ...golfer,
      [searchParameters.GOLFER_ID]: ghin,
    }))

    const searchParams = new URLSearchParams()

    const courseHandicapRequest: CourseHandicapsRequest = {
      golfers,
      source: CLIENT_SOURCE
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

  async golfersSearch(request: GolferSearchRequest): Promise<GolferSearchResponse['golfers']> {
    const { ghin, ...params} = schemaGolferSearchRequest.parse(request)
    const searchParams = new URLSearchParams()

    const searchDefaults = {
      from_ghin: true,
      per_page: 25,
      sorting_criteria: 'full_name',
      order: 'asc',
      page: 1,
    }

    Object.entries(searchDefaults).forEach(([key, value]) => {
      searchParams.set(key, value.toString())
    })

    Object.entries(params).forEach(([key, value]) => {
      searchParams.set(key, value.toString())
    })

    if (ghin) {
      searchParams.set(searchParameters.GOLFER_ID, ghin.toString())
    }

    const options: Parameters<typeof this.httpClient.fetch>[0]['options'] = {
      searchParams,
    }

    const { golfers } = await this.httpClient.fetch<GolferSearchResponse>({ entity: 'golfers_search', schema: schemaGolferSearchResponse, options })

    return golfers
  }

  async golfersGetOne(ghinNumber: number): Promise<GolferSearchResponse['golfers'][number] | undefined> {
    const ghin = number.parse(ghinNumber)
    const [golfer] = await this.golfersSearch({ ghin: ghin, status: 'Active' })

    return golfer
  }

  async golfersGetScores(ghinNumber: number, request?: ScoresRequest): Promise<ScoresResponse> {
    const validRequest = schemaScoresRequest.parse(request) ?? {}
    const ghin = number.parse(ghinNumber)
    const searchParams = new URLSearchParams()

    searchParams.set(searchParameters.GOLFER_ID, ghin.toString())
    
    Object.entries(validRequest).forEach(([key, value]) => {
      if (value === null) {
        return
      }

      if (Array.isArray(value)) {
        value.forEach((v, index) => {
          if (index === 0) {
            searchParams.set(key, v.toString())
          } else {
            searchParams.append(key, v.toString())
          }
        })

        return
      }

      if (typeof value === 'object' && value instanceof Date) {
        searchParams.set(key, value.toISOString())
        
        return
      }

      searchParams.set(key, value.toString())
    })

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

export { GhinClient, ClientConfig as GhinClientConfig };

