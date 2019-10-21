import { MultiaddrResponse } from './types'

export type WalletAPI = {
  authorizeLogin: (token: any, confirm: any) => any
  createPayload: (email: any, data: any) => any
  createPinEntry: (key: any, value: any, pin: any) => any
  deauthorizeBrowser: (sessionToken: any) => any
  fetchBlockchainData: (
    context: any,
    {
      n,
      offset,
      onlyShow
    }: {
      n: number
      offset: void | number
      onlyShow: any
    }
  ) => Promise<MultiaddrResponse>
  fetchPayloadWithSession: (guid: any, sessionToken: any) => any
  fetchPayloadWithSharedKey: (guid: any, sharedKey: any) => any
  fetchPayloadWithTwoFactorAuth: (
    guid: any,
    sessionToken: any,
    twoFactorCode: any
  ) => any
  generateUUIDs: (count: any) => any
  getPairingPassword: (guid: any) => any
  getPinValue: (key: any, pin: any) => any
  handle2faReset: (token: any) => any
  obtainSessionToken: () => any
  pollForSessionGUID: (sessionToken: any) => any
  remindGuid: (email: any, captcha: any, sessionToken: any) => any
  resendSmsLoginCode: (guid: any, sessionToken: any) => any
  reset2fa: (
    guid: any,
    email: any,
    newEmail: any,
    secretPhrase: any,
    message: any,
    code: any,
    sessionToken: any
  ) => any
  savePayload: (data: any) => any
  verifyEmailToken: (token: any) => any
}
