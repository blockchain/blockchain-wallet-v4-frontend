export type MiscAPI = {
  getCaptchaImage: (timestamp: any, sessionToken: any) => any
  getTransactionHistory: (
    coin: any,
    active: any,
    currency: any,
    start: any,
    end: any
  ) => any
  getLogs: (guid: any, sharedKey: any) => any
  getPriceIndexSeries: (coin: any, currency: any, start: any, scale: any) => any
  getRandomBytes: (bytes: any, format: any) => any
  getWalletNUsers: () => any
}
