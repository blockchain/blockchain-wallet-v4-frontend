import * as custodialBalanceSelectors from './custodial.selectors'
import * as fiatBalanceSelectors from './fiat.selectors'
import * as nonCustodialBalanceSelectors from './non-custodial.selectors'
import * as totalBalanceSelectors from './total.selectors'

export default {
  ...custodialBalanceSelectors,
  ...fiatBalanceSelectors,
  ...nonCustodialBalanceSelectors,
  ...totalBalanceSelectors
}
