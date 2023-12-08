import { z } from "zod";

const boolean = z
  .union([z.boolean(), z.literal('true'), z.literal('false'), z.null()])
  .transform((value) => value === true || value === 'true');

const date = z
  .union([z.date(), z.string()])
  .refine((value) => (value ? !isNaN(Date.parse(value.toString())) : true), {
    message: 'Invalid date',
  })
  .transform((value) => (value ? new Date(value) : undefined));

const monthDay = z
  .union([z.date(), z.string(), z.null()])
  .refine((value) => (value ? !isNaN(Date.parse(value.toString())) : true), {
    message: 'Invalid date',
  })
  .transform((value) => {
    if (typeof value !== 'string') {
      return value;
    }

    const [month, day] = value.split('/');

    return new Date(`1900-${month}-${day}T00:00Z`);
  });

const emptyString = z.string().trim();
const emptyStringToNull = emptyString.nullable().transform((value) => value || null);
const float = z.coerce.number();
const gender = z.enum(['M', 'F']);

const handicap = z
  .union([z.number(), z.string(), z.null()])
  .refine((value) => {
    if (typeof value === "number") {
      return true;
    }

    if (typeof value === "string" && value === "NH") {
      return true;
    }

    return false;
  })
  .transform((value) => {
    if (value === "NH") {
      return null;
    }

    return value;
  });

const number = float.int();
const string = emptyString.min(1);

export {
  boolean,
  date,
  emptyStringToNull,
  float,
  gender,
  handicap,
  monthDay,
  number,
  string,
};
