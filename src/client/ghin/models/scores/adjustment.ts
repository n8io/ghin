import { z } from "zod";
import { float, string } from "../../../../models";

const schemaScoringAdjustment = z.object({
  display: string,
  type: string,
  value: float,
})

type ScoringAdjustment = z.infer<typeof schemaScoringAdjustment>

export { ScoringAdjustment, schemaScoringAdjustment };