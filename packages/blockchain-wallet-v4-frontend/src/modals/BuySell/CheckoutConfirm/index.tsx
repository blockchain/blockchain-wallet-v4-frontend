import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { clearSubmitErrors } from 'redux-form'

import { Remote } from '@core'
import { ExtractSuccess } from '@core/types'
import Error from 'components/BuySell/Error'
import { GenericNabuErrorFlyout } from 'components/GenericNabuErrorFlyout'
import { actions, model, selectors } from 'data'
import { ClientErrorProperties, PartialClientErrorProperties } from 'data/analytics/types/errors'
import { RootState } from 'data/rootReducer'
import { Analytics, BSCheckoutFormValuesType } from 'data/types'
import { isNabuError } from 'services/errors'

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

  handleBack = () => {
    if (!this.props.pendingOrder) {
      this.props.buySellActions.destroyCheckout()

      return
    }

    this.props.buySellActions.cancelOrder(this.props.pendingOrder)
  }

  handleReset = () => {
    this.props.buySellActions.destroyCheckout()
  }

  handleRetry = () => {
    if (!this.props.pendingOrder) {
      this.props.buySellActions.destroyCheckout()

      return
    }

    this.props.buySellActions.createOrderSuccess(this.props.pendingOrder)
  }

  trackError = (error: PartialClientErrorProperties | string) => {
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

        if (isNabuError(e)) {
          return <GenericNabuErrorFlyout error={e} onDismiss={this.handleBack} />
        }

        return (
          <Error
            code={e}
            handleRetry={this.handleRetry}
            handleReset={this.handleReset}
            handleBack={this.handleBack}
          />
        )
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
  mobilePaymentMethod: selectors.components.buySell.getBSMobilePaymentMethod(state),
  pendingOrder: selectors.components.buySell.getBSPendingOrder(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  clearFormError: () => dispatch(clearSubmitErrors(FORM_BS_CHECKOUT)),
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
