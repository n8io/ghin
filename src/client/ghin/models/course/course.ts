import { z } from 'zod'
import { number, shortDate, string } from '../../../../models'
import { schemaGeoCoordinate } from './geolocation'

const schemaStatus = string.transform((value) => value.toUpperCase()).pipe(z.enum(['ACTIVE', 'INACTIVE']))

const schemaCourse = z.object({
  Address1: string.nullable(),
  Address2: string.nullable(),
  City: string.nullable(),
  Country: string.nullable(),
  CourseID: number,
  CourseName: string,
  CourseStatus: schemaStatus,
  Email: string.email().nullable(),
  EntCountryCode: number.nullable(),
  EntStateCode: number.nullable(),
  FacilityID: number,
  FacilityName: string,
  FacilityStatus: schemaStatus,
  FullName: string,
  GeoLocationLatitude: schemaGeoCoordinate.nullable(),
  GeoLocationLongitude: schemaGeoCoordinate.nullable(),
  LegacyCRPCourseId: number.nullable(),
  Ratings: z.array(z.unknown()),
  State: string.nullable(),
  Telephone: string.nullable(),
  UpdatedOn: shortDate.nullable(),
  Zip: z
    .string()
    .trim()
    .transform((zip) => zip?.trim() || null)
    .nullable()
    .or(z.array(z.unknown())),
})

type Course = z.infer<typeof schemaCourse>

export { schemaCourse }
export type { Course }
