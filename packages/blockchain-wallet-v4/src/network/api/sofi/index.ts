import { SofiMigrationStatusResponseType } from './types'

export default ({ authorizedGet, authorizedPost, authorizedPut, get, nabuUrl }) => {
  const sofiMigrationStatusJwt = (
    aesIV,
    aesCiphertext,
    aesTag,
    aesKeyCiphertext
  ): SofiMigrationStatusResponseType =>
    get({
      contentType: 'application/json',
      endPoint: '/sofi/user-migration-status',
      headers: {
        // can have nabu session token if sofi jwt
        // is not available
        'X-SoFi-AES-IV': aesIV,
        'X-SoFi-AES-Key-Ciphertext': aesKeyCiphertext,
        'X-SoFi-AES-Tag': aesTag,
        'X-SoFi-JWT-AES-Ciphertext': aesCiphertext
      },
      url: nabuUrl
    })

  const sofiMigrationStatusNabuToken = (): SofiMigrationStatusResponseType =>
    authorizedGet({
      contentType: 'application/json',
      endPoint: '/sofi/user-migration-status',
      url: nabuUrl
    })

  const associateNabuUser = (aesIV, aesCiphertext, aesTag, aesKeyCiphertext) =>
    authorizedPut({
      contentType: 'application/json',
      endPoint: '/sofi/associate-nabu-user',
      headers: {
        'X-SoFi-AES-IV': aesIV,
        'X-SoFi-AES-Key-Ciphertext': aesKeyCiphertext,
        'X-SoFi-AES-Tag': aesTag,
        'X-SoFi-JWT-AES-Ciphertext': aesCiphertext
      },
      url: nabuUrl
    })

  const migrateSofiUser = (ssn) =>
    authorizedPost({
      contentType: 'application/json',
      data: {
        ssn
      },
      endPoint: '/sofi/migrate-sofi-user',
      url: nabuUrl
    })

  return {
    associateNabuUser,
    migrateSofiUser,
    sofiMigrationStatusJwt,
    sofiMigrationStatusNabuToken
  }
}
