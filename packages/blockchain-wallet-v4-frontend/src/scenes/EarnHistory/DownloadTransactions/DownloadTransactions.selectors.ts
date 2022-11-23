import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'

export const getData = (state) => {
  const transactionsReportR = selectors.components.interest.getInterestTransactionsReport(state)

  const transform = (transactionsReport: ExtractSuccess<typeof transactionsReportR>) => ({
    transactionsReport
  })
  return lift(transform)(transactionsReportR)
}

export default getData
