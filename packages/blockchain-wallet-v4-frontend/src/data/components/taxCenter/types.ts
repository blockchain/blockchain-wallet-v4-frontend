import { RemoteDataType } from '@core/remote/types'

export type TaxCenterState = {
  createReport: RemoteDataType<string, string>
  fetchError: boolean
  reports: RemoteDataType<string, ReportType[]>
  test: RemoteDataType<string, boolean>
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
