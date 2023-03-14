import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { InjectedFormProps, reduxForm } from 'redux-form'

import { FlyoutOopsError } from 'components/Flyout/Errors'
import { GenericNabuErrorFlyout } from 'components/GenericNabuErrorFlyout'
import { actions } from 'data'
import { Analytics } from 'data/types'
import { isNabuError } from 'services/errors'

import { Props as BaseProps, SuccessStateType } from '..'
import Loading from '../template.loading'
import { PreviewSwapSuccess } from './PreviewSwapSuccess'
import { getData } from './selectors'

const PreviewSwap = (props: Props) => {
  const dispatch = useDispatch()

  const data = useSelector(getData)

  useEffect(() => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.SWAP_CHECKOUT_VIEWED,
        properties: {}
      })
    )
  }, [])

  const onClickBack = () => {
    dispatch(
      actions.components.swap.setStep({
        step: 'ENTER_AMOUNT'
      })
    )

    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.SWAP_CHECKOUT_SCREEN_BACK_CLICKED,
        properties: {}
      })
    )
  }

  const trackExchangeTooltip = () => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.SWAP_PRICE_TOOLTIP_CLICKED,
        properties: {}
      })
    )
  }

  const createOrder = () => {
    dispatch(actions.components.swap.createOrder())

    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.SWAP_CHECKOUT_SCREEN_SUBMITTED,
        properties: {}
      })
    )
  }

  const clearErrors = () => {
    dispatch(actions.form.clearSubmitErrors('previewSwap'))
  }

  const returnToInitSwap = () => {
    dispatch(actions.components.swap.returnToInitSwap())
  }

  return data.cata({
    Failure: (e) => {
      if (isNabuError(e)) {
        return <GenericNabuErrorFlyout error={e} onDismiss={onClickBack} />
      }

      return (
        <FlyoutOopsError
          action='retry'
          data-e2e='previewSwapFailure'
          handler={onClickBack}
          errorMessage={e}
        />
      )
    },
    Loading: () => <Loading />,
    NotAsked: () => <Loading />,
    Success: (val) => (
      <PreviewSwapSuccess
        {...val}
        onClickBack={onClickBack}
        submitting={props.submitting}
        trackExchangeTooltip={trackExchangeTooltip}
        createOrder={createOrder}
        clearErrors={clearErrors}
        returnToInitSwap={returnToInitSwap}
      />
    )
  })
}

const enhance = compose(reduxForm<{}, OwnProps>({ destroyOnUnmount: false, form: 'previewSwap' }))

type OwnProps = BaseProps & SuccessStateType & { handleClose: () => void }
export type Props = OwnProps & InjectedFormProps<{}, OwnProps>

export default enhance(PreviewSwap)
