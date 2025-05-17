import { z } from 'zod'
import { boolean, date, number, string } from '../../../../models'
import { schemaCourseCountryCode } from './country'
import { schemaCourseSearchState } from './state'

const schemaCourseSearchRequest = z
  .object({
    country: schemaCourseCountryCode.optional(),
    facility_id: number.optional(),
    name: string.optional(),
    state: schemaCourseSearchState.optional(),
    updated_at: date.optional(),
  })
  .refine(
    ({ country, state, facility_id, updated_at }) => {
      switch (true) {
        case Boolean(country && state):
        case Boolean(facility_id):
        case Boolean(updated_at):
          return true
        default:
          return false
      }
    },
    {
      message:
        'At least one of the following are required: country, name, state, facility_id, or updated_at must be provided',
    }
  )

type CourseSearchRequest = z.infer<typeof schemaCourseSearchRequest>

const schemaCourseDetailsRequest = z.object({
  course_id: number,
  include_altered_tees: boolean.optional(),
})

type CourseDetailsRequest = z.infer<typeof schemaCourseDetailsRequest>

export { schemaCourseSearchRequest, schemaCourseDetailsRequest }
export type { CourseSearchRequest, CourseDetailsRequest }
