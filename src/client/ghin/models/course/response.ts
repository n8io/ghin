import { z } from 'zod'
import { boolean, float, monthDay, number, string } from '../../../../models'
import { schemaCourseCountry } from './country'
import { schemaCourse } from './course'
import { schemaGeoCoordinate } from './geolocation'
import { schemaCourseSearchState } from './state'

const schemaStatus = string.transform((value) => value.toUpperCase()).pipe(z.enum(['ACTIVE', 'INACTIVE']))

const schemaCourseCountriesResponse = z.object({
  countries: z.array(schemaCourseCountry.passthrough()),
})

type CourseCountriesResponse = z.infer<typeof schemaCourseCountriesResponse>

const schemaCourseSearchResponse = z.object({
  courses: z.array(schemaCourse.passthrough()),
})

type CourseSearchResponse = z.infer<typeof schemaCourseSearchResponse>

const schemaCourseDetailsFacility = z.object({
  FacilityId: number,
  FacilityName: string,
  FacilityNumber: number.nullable(),
  FacilityStatus: string,
  GeoLocationFormattedAddress: string.nullable(),
  GeoLocationLatitude: schemaGeoCoordinate.nullable(),
  GeoLocationLongitude: schemaGeoCoordinate.nullable(),
  GolfAssociationId: number.nullable(),
})

const schemaCourseDetailsSeason = z.object({
  IsAllYear: boolean,
  SeasonEndDate: monthDay.nullable(),
  SeasonName: string,
  SeasonStartDate: monthDay.nullable(),
})

const schemaCourseDetailsTeeSetRatings = z.object({
  BogeyRating: float,
  CourseRating: float,
  RatingType: z.enum(['Front', 'Back', 'Total']),
  SlopeRating: float,
})

const schemaCourseDetailsTeeSetHole = z.object({
  Allocation: number,
  HoleId: number,
  Length: number,
  Number: number,
  Par: number,
})

const schemaCourseDetailsTeeSet = z.object({
  EligibleSides: z.unknown(),
  Gender: z.enum(['Male', 'Female', 'Mixed']).nullable(),
  Holes: z.array(schemaCourseDetailsTeeSetHole),
  HolesNumber: number,
  IsShorter: boolean.nullable(),
  LegacyCRPTeeId: number,
  Ratings: z.array(schemaCourseDetailsTeeSetRatings),
  StrokeAllocation: boolean,
  TeeSetRatingId: number,
  TeeSetRatingName: string,
  TotalMeters: number,
  TotalPar: number,
  TotalYardage: number,
})

const schemaCourseDetailsResponse = z.object({
  CourseCity: string,
  CourseId: number,
  CourseName: string,
  CourseNumber: number.nullable(),
  CourseState: schemaCourseSearchState,
  CourseStatus: schemaStatus,
  Facility: schemaCourseDetailsFacility,
  Season: schemaCourseDetailsSeason,
  TeeSets: z.array(schemaCourseDetailsTeeSet),
})

type CourseDetailsResponse = z.infer<typeof schemaCourseDetailsResponse>

export { schemaCourseCountriesResponse, schemaCourseDetailsResponse, schemaCourseSearchResponse }
export type { CourseCountriesResponse, CourseDetailsResponse, CourseSearchResponse }
