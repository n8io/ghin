import { z } from 'zod'
import { boolean, date, float, gender, monthDay, number, string } from '../../../../models'
import { schemaScoringAdjustment } from './adjustment'
import { schemaHoleDetail } from './hole-detail'
import { schemaStatistics } from './statistics'

type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

const rawScoreTypes = ['A', 'C', 'E', 'H', 'N', 'P', 'T'] as const
const schemaRawScoreTypes = z.enum(rawScoreTypes)
type RawScoreType = z.infer<typeof schemaRawScoreTypes>

const scoreTypes = ['AWAY', 'COMPETITION', 'EXCEPTIONAL', 'HOME', '9_HOLE_ROUNDS', 'PENALTY', 'TOURNAMENT'] as const
const schemaScoreType = z.enum(scoreTypes)
type ScoreType = z.infer<typeof schemaScoreType>

const scoreTypesMap: Record<RawScoreType, ScoreType> = {
  A: 'AWAY',
  C: 'COMPETITION',
  E: 'EXCEPTIONAL',
  H: 'HOME',
  N: '9_HOLE_ROUNDS',
  P: 'PENALTY',
  T: 'TOURNAMENT',
} as const

// @ts-expect-error ???
const schemaScoreTypeWithTransform: z.ZodType<RawScoreType, z.ZodTypeDef, ScoreType> = schemaRawScoreTypes.transform(
  (value) => scoreTypesMap[value]
)

const scoreStatuses = ['VALIDATED', 'UNDER_REVIEW'] as const
const schemaScoreStatus = z.enum(scoreStatuses)
type ScoreStatus = z.infer<typeof schemaScoreStatus>

const rawScoreStatuses = ['Validated', 'UnderReview'] as const
const schemaRawScoreStatus = z.enum(rawScoreStatuses)

const scoreStatusesMap = {
  Validated: 'VALIDATED',
  UnderReview: 'UNDER_REVIEW',
} as const

const schemaScoreStatusWithTransform = schemaRawScoreStatus.transform(
  (value) => scoreStatusesMap[value as keyof typeof scoreStatusesMap]
)

const schemaScore = z.object({
  adjusted_gross_score: number,
  adjustments: z.array(schemaScoringAdjustment),
  back9_adjusted: number.nullable(),
  back9_course_rating: float.nullable(),
  back9_slope_rating: float.nullable(),
  course_rating: float,
  differential: float,
  edited: boolean,
  exceptional: boolean,
  front9_adjusted: number.nullable(),
  front9_course_rating: float.nullable(),
  front9_slope_rating: float.nullable(),
  gender,
  golfer_id: number,
  hole_details: z.array(schemaHoleDetail),
  id: number,
  is_manual: boolean,
  is_recent: boolean,
  message_club_authorized: string.nullable(),
  net_score_differential: float.nullable(),
  number_of_holes: number,
  number_of_played_holes: number,
  order_number: number,
  parent_id: number.nullable(),
  pcc: float,
  penalty_method: string.nullable(),
  penalty_type: string.nullable(),
  penalty: boolean.optional(),
  played_at: date,
  posted_at: date,
  revision: boolean,
  score_day_order: number,
  score_type_display_full: string,
  score_type_display_short: string,
  score_type: schemaScoreTypeWithTransform,
  season_end_date_at: monthDay,
  season_start_date_at: monthDay,
  slope_rating: float,
  statistics: schemaStatistics.nullable().optional(),
  status: schemaScoreStatusWithTransform,
  unadjusted_differential: float,
  used: boolean,
})

type Score = Prettify<z.infer<typeof schemaScore>>

export { rawScoreTypes, schemaScore }
export type { Score, ScoreType, ScoreStatus }
