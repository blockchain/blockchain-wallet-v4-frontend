import { ReportType } from 'data/components/taxCenter/types'

export default ({ authorizedGet, nabuUrl }) => {
  const getReports = (): Array<ReportType> =>
    authorizedGet({
      endPoint: '/reports/taxes',
      url: nabuUrl
    })

  return {
    getReports
  }
}
