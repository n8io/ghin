import { z } from "zod";
import { date, number, string } from "../../../../models";

const schemaScoresRequest = z.object({
  course_id: number,
  from_date_played: date,
  score_types: z.array(z.enum(['A', 'C', 'H'])),
  statuses: z.array(string),
  tee_set_id: number,
  to_date_played: date,
  offset: number.default(0),
  limit: number.default(100),
}).partial().default({}).optional()

type ScoresRequest = z.infer<typeof schemaScoresRequest>

export { ScoresRequest, schemaScoresRequest };
