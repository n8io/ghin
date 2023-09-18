import { GhinClientConfig, schemaGhinClientConfig } from "./models";

class GhinClient {
  private apiVersion: string = 'v1'
  private baseUrl = new URL('https://api2.ghin.com')
  private basePathname = `/api/${this.apiVersion}`
  private config: GhinClientConfig

  constructor(config: GhinClientConfig) {
    this.config = schemaGhinClientConfig.parse(config)
  }
}

export default GhinClient