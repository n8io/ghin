import { z } from 'zod'
import { string } from '../../../models'
import { schemaAccessToken } from './access-token'

const schemaSession = z.object({
  appId: string,
  authVersion: string,
  fid: string,
  sdkVersion: string,
})

type Session = z.infer<typeof schemaSession>

const schemaSessionResponse = z.object({
  authToken: schemaAccessToken,
})

type SessionResponse = z.infer<typeof schemaSessionResponse>

export type { Session, SessionResponse }
export { schemaSession, schemaSessionResponse }
