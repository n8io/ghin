import { z } from "zod";
import { string } from "../../../models/validation";

const schemaClientConfig = z.object({
  password: string,
  username: string,
})

type ClientConfig = z.infer<typeof schemaClientConfig>

export { ClientConfig, schemaClientConfig };
