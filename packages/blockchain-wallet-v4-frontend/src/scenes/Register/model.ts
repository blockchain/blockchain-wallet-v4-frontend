export const REGISTER_FORM = 'register'

export type SignupInitValues = {
  country?: string
  email?: string
}

export type GeoLocation = {
  countryCode: string
  headerBlockchainCFIpCountry: string
  headerBlockchainGoogleIpCountry: string
  headerBlockchainGoogleIpRegion: string
  ip: string
}
