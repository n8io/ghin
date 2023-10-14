import { z } from "zod";

const schemaStringOrUndefined = z.union([z.string(), z.undefined()])
const schemaPromiseOrNonPromiseStringOrUndefined = z.union([z.promise(schemaStringOrUndefined), schemaStringOrUndefined])
const schemaPromiseOrNonPromiseVoid = z.union([z.promise(z.void()), z.void()])

const schemaCacheClient = z.object({
  read: z.function().args().returns(schemaPromiseOrNonPromiseStringOrUndefined),
  write: z.function().args(z.string()).returns(schemaPromiseOrNonPromiseVoid),
})

type CacheClient = z.infer<typeof schemaCacheClient>

export { CacheClient, schemaCacheClient };
