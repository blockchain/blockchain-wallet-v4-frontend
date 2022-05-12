export type NftMarkForSaleFormValues = {
  ending: string
  expirationDays: number
  fix: 'CRYPTO' | 'FIAT'
  fixAmount: string
  starting: string
  timedAuctionType: string
}
