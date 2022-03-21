import { ReportType } from 'data/components/taxCenter/types'

export default ({ authorizedGet, authorizedPost, nabuUrl }) => {
  const createReport = (data) =>
    authorizedPost({
      contentType: 'application/json',
      data,
      endPoint: '/reports/taxes',
      url: nabuUrl
    })

  const getReports = (): Array<ReportType> =>
    authorizedGet({
      endPoint: '/reports/taxes',
      url: nabuUrl
    })

  return {
    createReport,
    getReports
  }
}
