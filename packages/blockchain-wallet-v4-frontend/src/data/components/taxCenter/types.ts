import { RemoteDataType } from '@core/remote/types'

export type TaxCenterState = {
  reportData: RemoteDataType<string, string>
  reports: Array<ReportType>
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
