import { z } from "zod";
import { number, string } from "../../../../models";

const schemaPlayerCourseHandicap = z.object({
  playing_handicap: number,
  playing_handicap_display: string,
  shots_off: number,
})

type CoursePlayerHandicap = z.infer<typeof schemaPlayerCourseHandicap>

const schemaCoursePercentPlayerHandicap = z.record(string, schemaPlayerCourseHandicap)

type CoursePercentPlayerHandicap = z.infer<typeof schemaCoursePercentPlayerHandicap>

export { CoursePercentPlayerHandicap, CoursePlayerHandicap, schemaCoursePercentPlayerHandicap, schemaPlayerCourseHandicap };
