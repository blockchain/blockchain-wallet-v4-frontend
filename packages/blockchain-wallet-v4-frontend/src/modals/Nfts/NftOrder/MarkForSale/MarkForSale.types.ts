export type NftMarkForSaleFormValues = {
  ending: string
  expirationMinutes: number
  fix: 'CRYPTO' | 'FIAT'
  fixAmount: string
  reserve: string
  starting: string
  timedAuctionType: string
}
