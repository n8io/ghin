import { z } from "zod";

const schemaGhinClientConfig = z.object({
  password: z.string().trim().min(1),
  username: z.string().trim().min(1),
})

type GhinClientConfig = z.infer<typeof schemaGhinClientConfig>

export { GhinClientConfig, schemaGhinClientConfig }