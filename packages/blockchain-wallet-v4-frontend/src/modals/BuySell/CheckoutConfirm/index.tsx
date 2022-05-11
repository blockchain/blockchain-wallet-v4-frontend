import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from '@core'
import { ExtractSuccess } from '@core/types'
import { GenericNabuError } from 'components/GenericNabuError'
import { actions, model, selectors } from 'data'
import { ClientErrorProperties, PartialClientErrorProperties } from 'data/analytics/types/errors'
import { RootState } from 'data/rootReducer'
import { Analytics, BSCheckoutFormValuesType } from 'data/types'

import Loading from '../template.loading'
import { getData } from './selectors'
import Success from './template.success'

const { FORM_BS_CHECKOUT } = model.components.buySell

class CheckoutConfirm extends PureComponent<Props> {
  componentDidMount() {
    this.props.sendActions.getLockRule()
    if (!Remote.Success.is(this.props.data)) {
      this.props.buySellActions.fetchSDDEligibility()
      this.props.buySellActions.fetchSDDVerified()
      this.props.buySellActions.fetchCards(false)
      this.props.brokerageActions.fetchBankTransferAccounts()
    }
  }

  trackError(error: PartialClientErrorProperties | string) {
    // not every remote type has been converted to a client error type so handle the string case
    if (typeof error === 'string') {
      error = { network_error_description: error }
    }
    this.props.analyticsActions.trackEvent({
      key: Analytics.CLIENT_ERROR,
      properties: {
        ...error,
        action: 'CheckoutConfirm',
        error: 'OOPS_ERROR',
        title: 'Oops! Something went wrong'
      } as ClientErrorProperties
    })
  }

  render() {
    return this.props.data.cata({
      Failure: (e) => {
        this.trackError(e)
        // return <DataError />
        return <GenericNabuError error={e} />
      },
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (val) => <Success {...this.props} {...val} />
    })
  }
}

const mapStateToProps = (state: RootState) => ({
  applePayInfo: selectors.components.buySell.getApplePayInfo(state),
  data: getData(state),
  formValues: selectors.form.getFormValues(FORM_BS_CHECKOUT)(state) as BSCheckoutFormValuesType,
  googlePayInfo: selectors.components.buySell.getGooglePayInfo(state),
  isFlexiblePricingModel: selectors.core.walletOptions
    .getFlexiblePricingModel(state)
    .getOrElse(false),
  mobilePaymentMethod: selectors.components.buySell.getBSMobilePaymentMethod(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  sendActions: bindActionCreators(actions.components.send, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  handleClose: () => void
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type LinkDispatchPropsType = ReturnType<typeof mapDispatchToProps>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(CheckoutConfirm)
