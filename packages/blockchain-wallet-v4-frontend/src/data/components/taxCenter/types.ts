import { RemoteDataType } from '@core/remote/types'

export type TaxCenterState = {
  report: RemoteDataType<string, string>
  reports: RemoteDataType<string, ReportType[]>
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
