import { z } from 'zod'
import { boolean, float, number, string } from '../../../../models'

const schemaHoleDetail = z.object({
  adjusted_gross_score: number,
  approach_shot_accuracy: float.nullable().default(0),
  drive_accuracy: float.nullable(),
  fairway_hit: boolean.nullable(),
  gir_flag: z.any(),
  hole_number: number,
  id: number,
  most_likely_score: number.nullable(),
  par: number,
  putts: number.nullable(),
  raw_score: number,
  stroke_allocation: number,
  x_hole: boolean,
})

type HoleDetail = z.infer<typeof schemaHoleDetail>

export type { HoleDetail }
export { schemaHoleDetail }
