import { z } from 'zod'
import { number } from '../../../../models'
import { CLIENT_SOURCE } from '../../../request-client'

const schemaTeeSetSide = z.enum(['All 18', 'F9', 'B9'])

type TeeSetSide = z.infer<typeof schemaTeeSetSide>

const schemaGolferCourseHandicapBaseRequest = z.object({
  ghin: number.optional(),
  handicap_index: number.optional(),
  tee_set_id: number,
  tee_set_side: schemaTeeSetSide,
})

const schemaGolferCourseHandicapRequest = schemaGolferCourseHandicapBaseRequest.refine(({ ghin, handicap_index }) => {
  if (ghin && handicap_index) {
    throw new Error('Cannot provide both ghin and handicap_index')
  }

  if (!Number.isSafeInteger(ghin) && !Number.isSafeInteger(handicap_index)) {
    throw new Error('Must provide either ghin or handicap_index')
  }

  return true
})

type GolferCourseHandicapRequest = z.infer<typeof schemaGolferCourseHandicapRequest>

const schemaCourseHandicapsRequest = z.object({
  golfers: z.array(
    schemaGolferCourseHandicapBaseRequest
      .omit({
        ghin: true,
      })
      .extend({
        golfer_id: number.optional(),
      })
  ),
  source: z.literal(CLIENT_SOURCE).default(CLIENT_SOURCE).optional(),
})

type CourseHandicapsRequest = z.infer<typeof schemaCourseHandicapsRequest>

export type { CourseHandicapsRequest, GolferCourseHandicapRequest, TeeSetSide }
export { schemaCourseHandicapsRequest, schemaGolferCourseHandicapRequest, schemaTeeSetSide }
