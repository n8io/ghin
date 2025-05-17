import { z } from 'zod'
import { string } from '../../../../models'

const FOREIGN_COUNTRY_CODE = 'Fo'

const schemaCourseCountryCode = string.refine((value) => {
  if (value === FOREIGN_COUNTRY_CODE) {
    return true
  }

  return /^[A-Z]{3}$/.test(value) // ISO 3166-1 alpha-3 code
}, 'Invalid country code. Expected format: ISO 3166-1 alpha-3 code or "Fo" for foreign countries')

const schemaCourseCountryState = z.object({
  code: string, //schemaCourseCountryCode,
  course_code: string, //schemaCourseCountryCode.nullable(),
  name: string,
})

const schemaCourseCountry = z.object({
  code: string,
  crs_code: z
    .string()
    .trim()
    .transform((value) => value || null)
    .nullable(),
  name: string,
  states: z.array(schemaCourseCountryState),
})

type CourseCountry = z.infer<typeof schemaCourseCountry>

export type { CourseCountry }
export { schemaCourseCountry, schemaCourseCountryCode }
