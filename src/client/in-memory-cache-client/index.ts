import { CacheClient } from "../../models";

class InMemoryCacheClient implements CacheClient {
  private value: string | undefined = undefined

  constructor() { }

  async read() {
    return this.value
  }

  async write(value: string) {
    this.value = value
  }
}

export { InMemoryCacheClient }