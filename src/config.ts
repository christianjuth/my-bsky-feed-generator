import { Database } from './db'
import { DidResolver } from '@atproto/did-resolver'

export type AppContext = {
  db: Database
  didResolver: DidResolver
  cfg: Config
}

export type Config = {
  port: number
  listenhost: string
  hostname: string
  sqliteLocation: string
  serviceDid: string
  publisherDid: string
  ownHandleDid: string
}

export type IndexerConfig = {
  sqliteLocation: string
  subscriptionEndpoint: string
  subscriptionReconnectDelay: number
}
