import { z } from "zod";
import { boolean, date, float, gender, monthDay, number, string } from "../../../../models";
import { schemaScoringAdjustment } from "./adjustment";
import { schemaHoleDetail } from "./hole-detail";
import { schemaStatistics } from "./statistics";

const schemaScoreStatus = z.enum(['Validated', 'UnderReview'])

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
  pcc: number,
  penalty_method: string.nullable(),
  penalty_type: string.nullable(),
  penalty: boolean.optional(),
  played_at: date,
  posted_at: date,
  revision: boolean,
  score_day_order: number,
  score_type_display_full: string,
  score_type_display_short: string,
  score_type: string,
  season_end_date_at: monthDay,
  season_start_date_at: monthDay,
  slope_rating: float,
  statistics: schemaStatistics.nullable().optional(),
  status: schemaScoreStatus,
  unadjusted_differential: float,
  used: boolean,
})

type Score = z.infer<typeof schemaScore>

export { Score, schemaScore };
