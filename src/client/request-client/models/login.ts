import { z } from 'zod'
import { string } from '../../../models'

const schemaLoginResponse = z.object({
  golfer_user: z.object({
    golfer_user_token: string,
  }),
})

type LoginResponse = z.infer<typeof schemaLoginResponse>

export type { LoginResponse }
export { schemaLoginResponse }
