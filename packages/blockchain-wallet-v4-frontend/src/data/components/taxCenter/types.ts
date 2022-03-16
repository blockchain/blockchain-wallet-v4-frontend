export type TaxCenterState = {
  createReportError: boolean
  fetchError: boolean
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
