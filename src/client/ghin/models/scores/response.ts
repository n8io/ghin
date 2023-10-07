import { z } from "zod";
import { float, number } from "../../../../models";
import { schemaScore } from "./score";

const schemaNumberOrDash = z.union([number, z.literal('-')]).transform((value) => value === '-' ? null : Number(value)) 
const schemaFloatOrDash = z.union([float, z.literal('-')]).transform((value) => value === '-' ? null : parseFloat(value.toString())) 

const schemaScoresResponse = z.object({
  average: schemaFloatOrDash.default(0),
  highest_score: schemaNumberOrDash,
  lowest_score: schemaNumberOrDash,
  scores: z.array(schemaScore),
  total_count: schemaNumberOrDash.default(0),
})

type ScoresResponse = z.infer<typeof schemaScoresResponse>

export { ScoresResponse, schemaScoresResponse };
