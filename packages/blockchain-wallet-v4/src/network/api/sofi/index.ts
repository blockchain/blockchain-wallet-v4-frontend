import { SofiMigrationStatusResponseType, SofiUserMigrationStatus } from './types'

export default ({ authorizedPatch, authorizedPost, get, nabuUrl, post }) => {
  const sofiMigrationStatus = (
    aesIV,
    aesCiphertext,
    aesTag,
    aesKeyCiphertext,
    nabuSessionToken
  ): SofiMigrationStatusResponseType =>
    get({
      contentType: 'application/json',
      endPoint: '/sofi/user-migration-status',
      headers: {
        // can have nabu session token if sofi jwt
        // is not available
        Authorization: `Bearer ${nabuSessionToken}`,
        'X-SoFi-AES-IV': aesIV,
        'X-SoFi-AES-Key-Ciphertext': aesKeyCiphertext,
        'X-SoFi-AES-Tag': aesTag,
        'X-SoFi-JWT-AES-Ciphertext': aesCiphertext
      },
      url: nabuUrl
    })

  const associateNabuUser = (aesIV, aesCiphertext, aesTag, aesKeyCiphertext) => {
    authorizedPatch({
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
  }
  const migrateSofiUser = (ssn) => {
    authorizedPost({
      contentType: 'application/json',
      data: {
        ssn
      },
      endPoint: '/sofi/migrate-sofi-user',
      url: nabuUrl
    })
  }
  return {
    associateNabuUser,
    migrateSofiUser,
    sofiMigrationStatus
  }
}
