import { z } from "zod";
import { schemaCacheClient, string } from "../../../models";

const schemaClientConfig = z.object({
  cache: schemaCacheClient,
  password: string,
  username: string,
})

type ClientConfig = z.infer<typeof schemaClientConfig>

export { ClientConfig, schemaClientConfig };
