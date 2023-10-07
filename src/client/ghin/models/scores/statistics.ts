import { z } from "zod";
import { date, emptyStringToNull, float, number } from "../../../../models";

const schemaStatistics = z.object({
  birdies_or_better_percent: float,
  bogeys_percent: float,
  double_bogeys_percent: float,
  fairway_hits_percent: float,
  gir_percent: float,
  last_stats_update_date: date,
  last_stats_update_type: emptyStringToNull,
  missed_general_approach_shot_accuracy_percent: float,
  missed_left_approach_shot_accuracy_percent: float,
  missed_left_percent: float,
  missed_long_approach_shot_accuracy_percent: float,
  missed_long_percent: float,
  missed_right_approach_shot_accuracy_percent: float,
  missed_right_percent: float,
  missed_short_approach_shot_accuracy_percent: float,
  missed_short_percent: float,
  one_putt_or_better_percent: float,
  par3s_average: float,
  par4s_average: float,
  par5s_average: float,
  pars_percent: float,
  putts_total: number,
  three_putt_or_worse_percent: float,
  triple_bogeys_or_worse_percent: float,
  two_putt_or_better_percent: float,
  two_putt_percent: float,
  up_and_downs_total: number,
})

type Statistics = z.infer<typeof schemaStatistics>

export { Statistics, schemaStatistics };
