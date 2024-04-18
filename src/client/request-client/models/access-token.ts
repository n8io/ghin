import { z } from 'zod'
import { string } from '../../../models'

const schemaAccessToken = z
  .object({
    expiresIn: string,
    token: string,
  })
  .transform(({ expiresIn: tmpExpiresIn, ...values }) => {
    const now = new Date()
    const secondsUntilExpiry = Number(tmpExpiresIn.replace(/[^0-9]/g, ''))
    const millisecondsUntilExpiry = secondsUntilExpiry * 1_000
    const expiresIn = new Date(now.getTime() + millisecondsUntilExpiry)

    return {
      ...values,
      expiresIn,
    }
  })

type AccessToken = z.infer<typeof schemaAccessToken>

export type { AccessToken }
export { schemaAccessToken }
