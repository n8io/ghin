import { z } from 'zod'
import { date, number, string } from '../../../../models'

const schemaScoresRequest = z
  .object({
    course_id: number,
    from_date_played: date,
    limit: number.default(100),
    offset: number.default(0),
    score_types: z.array(z.enum(['A', 'C', 'E', 'H', 'N', 'P'])), // H - Home, A - Away, C - Competition, N - 9-Hole Rounds, P - Penalty, E - Exceptional
    statuses: z.array(string),
    tee_set_id: number,
    to_date_played: date,
  })
  .partial()
  .default({})
  .optional()

type ScoresRequest = z.infer<typeof schemaScoresRequest>

export type { ScoresRequest }
export { schemaScoresRequest }
