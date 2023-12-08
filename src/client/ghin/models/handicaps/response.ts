import { z } from "zod";
import { boolean, handicap, number, string } from "../../../../models";
import { schemaCoursePercentPlayerHandicap } from "./course-player-handicap";

const schemaGolferHandicapResponse = z
  .object({
    golfer: z.object({
      clubs: z.array(
        z.object({
          active: boolean,
          association_id: number,
          club_name: string,
          id: number,
        })
      ),
      handicap_index: handicap,
    }),
  })
  .passthrough();

type HandicapResponse = z.infer<typeof schemaGolferHandicapResponse>;

const schemaCoursePlayerHandicapsResponse = z.object({
  100: schemaCoursePercentPlayerHandicap,
  95: schemaCoursePercentPlayerHandicap,
  90: schemaCoursePercentPlayerHandicap,
  85: schemaCoursePercentPlayerHandicap,
  80: schemaCoursePercentPlayerHandicap,
  75: schemaCoursePercentPlayerHandicap,
  70: schemaCoursePercentPlayerHandicap,
  65: schemaCoursePercentPlayerHandicap,
  60: schemaCoursePercentPlayerHandicap,
  55: schemaCoursePercentPlayerHandicap,
  50: schemaCoursePercentPlayerHandicap,
  45: schemaCoursePercentPlayerHandicap,
  40: schemaCoursePercentPlayerHandicap,
  35: schemaCoursePercentPlayerHandicap,
  30: schemaCoursePercentPlayerHandicap,
  25: schemaCoursePercentPlayerHandicap,
  20: schemaCoursePercentPlayerHandicap,
  15: schemaCoursePercentPlayerHandicap,
  10: schemaCoursePercentPlayerHandicap,
  5: schemaCoursePercentPlayerHandicap,
});

type CoursePlayerHandicapsResponse = z.infer<
  typeof schemaCoursePlayerHandicapsResponse
>;

export {
  CoursePlayerHandicapsResponse,
  HandicapResponse,
  schemaCoursePlayerHandicapsResponse,
  schemaGolferHandicapResponse,
};

