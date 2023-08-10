import React, { memo, useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from '@core'
import { BSPairType, ExtractSuccess } from '@core/types'
import { FlyoutOopsError } from 'components/Flyout/Errors'
import { GenericNabuErrorFlyout } from 'components/GenericNabuErrorFlyout'
import { actions, model, selectors } from 'data'
import { ClientErrorProperties } from 'data/analytics/types/errors'
import { RootState } from 'data/rootReducer'
import { Analytics, BSCheckoutFormValuesType } from 'data/types'
import { isNabuError } from 'services/errors'

import Loading from '../template.loading'
import { getData } from './selectors'
import Success from './template.success'

const { FORM_BS_CHECKOUT } = model.components.buySell

const CheckoutConfirm = memo((props: Props) => {
  const handleBack = () => {
    props.buySellActions.returnToBuyEnterAmount({ pair: props.pair })
  }

  const trackError = (error: Error | string) => {
    // not every remote type has been converted to a client error type so handle the string case
    const errorPayload = typeof error === 'string' ? { network_error_description: error } : error

    props.analyticsActions.trackEvent({
      key: Analytics.CLIENT_ERROR,
      properties: {
        ...errorPayload,
        action: 'CheckoutConfirm',
        error: 'OOPS_ERROR',
        title: 'Oops! Something went wrong'
      } as ClientErrorProperties
    })
  }

  useEffect(() => {
    props.sendActions.getLockRule()
    if (!Remote.Success.is(props.data)) {
      props.buySellActions.fetchCards(false)
      props.brokerageActions.fetchBankTransferAccounts()
    }
  }, [])

  return props.data.cata({
    Failure: (e) => {
      trackError(e)

      if (isNabuError(e)) {
        return <GenericNabuErrorFlyout error={e} onDismiss={handleBack} />
      }

      return (
        <FlyoutOopsError
          action='retry'
          data-e2e='sbCheckoutConfirmFailure'
          handler={handleBack}
          errorMessage={e}
        />
      )
    },
    Loading: () => <Loading />,
    NotAsked: () => <Loading />,
    Success: (val) => <Success {...props} {...val} />
  })
})

const mapStateToProps = (state: RootState) => ({
  availableToTradeWithdraw: selectors.core.walletOptions
    .getFeatureFlagAvailableToTradeWithdraw(state)
    .getOrElse(false) as boolean,
  data: getData(state),
  formValues: selectors.form.getFormValues(FORM_BS_CHECKOUT)(state) as BSCheckoutFormValuesType,
  mobilePaymentMethod: selectors.components.buySell.getBSMobilePaymentMethod(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  sendActions: bindActionCreators(actions.components.send, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  handleClose: () => void
  pair: BSPairType
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type LinkDispatchPropsType = ReturnType<typeof mapDispatchToProps>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(CheckoutConfirm)
