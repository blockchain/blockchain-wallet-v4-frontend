import { RemoteDataType } from '@core/remote/types'

export type TaxCenterState = {
  reportGenerationStatus: RemoteDataType<string, string>
  reports: RemoteDataType<null, ReportType[]>
}

export type ReportGenerateRequestType = {
  from: string
  to: string
  walletData: RemoteDataType<
    string,
    {
      bchImportedAddresses: Array<string>
      bchXPubs: Array<string>
      btcBech32XPubs: Array<string>
      btcImportedAddresses: Array<string>
      btcLegacyXPubs: Array<string>
      ethAddresses: Array<string>
      xlmAddresses: Array<string>
    }
  >
}

export type ReportType = {
  filePath: string
  from: string
  id: string
  status: string
  to: string
  type: string
  userId: string
}
