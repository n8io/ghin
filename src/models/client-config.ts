import { z } from 'zod'
import { schemaCacheClient } from './cache-client'
import { string } from './validation'

const schemaClientConfig = z.object({
  cache: schemaCacheClient.optional(),
  password: string,
  username: string,
})

type ClientConfig = z.infer<typeof schemaClientConfig>

export type { ClientConfig }
export { schemaClientConfig }
