export type SofiMigrationStatusResponseType = {
  migration_status: SofiUserMigrationStatus
  nabu_user: null | {
    email: string
    id: string
  }
  sofiJwtPayload: {
    // SoFi user email
    country: string // Internal SoFi user ID
    email: string
    // Token generation time
    exp: number
    // SoFi user state
    iat: number
    // SoFi user country, ISO 3166-1 alpha2
    state: string
    user: string // Token expiry time (iat + 30 minutes)
  }
}

export enum SofiUserMigrationStatus {
  AWAITING_USER = 'AWAITING_USER',
  FAILURE = 'FAILURE',
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS'
}

export type SofiMigrationResponseType = {
  migration_status: SofiUserMigrationStatus
}
