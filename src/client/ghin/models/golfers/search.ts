import { z } from "zod";
import { boolean, date, emptyStringToNull, float, gender, number, string } from "../../../../models";

const schemaGolferStatus = z.enum(['Active', 'Inactive'])

const schemaGolferSearchRequest = z.object({
  country: string.transform((value) => value?.toUpperCase()),
  first_name: string,
  from_ghin: boolean,
  ghin: number,
  last_name: string.optional(),
  order: z.enum(['asc', 'desc']),
  page: number,
  per_page: number.max(100),
  sorting_criteria: z.enum(['country', 'full_name', 'handicap_index', 'state', 'status']),
  state: string.transform((value) => value?.toUpperCase()),
  status: schemaGolferStatus,
}).partial()

type GolferSearchRequest = z.infer<typeof schemaGolferSearchRequest>

const schemaGolfer = z.object({
  ghin: number,
  first_name: string,
  last_name: string,
  association_id: number,
  association_name: string,
  handicap_index: float.nullable(),
  club_affiliation_id: number,
  club_id: number,
  club_name: emptyStringToNull,
  country: emptyStringToNull,
  entitlement: boolean,
  gender,
  hard_cap: boolean,
  has_digital_profile: boolean,
  hi_display: string,
  hi_value: float,
  is_home_club: boolean,
  low_hi_date: date.nullable(),
  low_hi_display: string,
  low_hi_value: float,
  low_hi: float.nullable(),
  message_club_authorized: string.nullable(),
  middle_name: emptyStringToNull.nullable().optional(),
  phone_number: emptyStringToNull.nullable().optional(),
  prefix: emptyStringToNull.optional(),
  rev_date: date.nullable(),
  soft_cap: boolean,
  state: emptyStringToNull,
  status: z.enum(['Active', 'Inactive']),
  suffix: emptyStringToNull.optional(),
})

type Golfer = z.infer<typeof schemaGolfer>

const schemaGolferSearchResponse = z.object({
  golfers: z.array(schemaGolfer)
})

type GolferSearchResponse = z.infer<typeof schemaGolferSearchResponse>

export { Golfer, GolferSearchRequest, GolferSearchResponse, schemaGolferSearchRequest, schemaGolferSearchResponse };

