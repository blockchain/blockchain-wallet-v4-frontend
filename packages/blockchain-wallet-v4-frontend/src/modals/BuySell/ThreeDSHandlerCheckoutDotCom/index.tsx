import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearSubmitErrors } from 'redux-form'

import BaseError from 'components/BuySell/Error'
import { GenericNabuErrorFlyout } from 'components/GenericNabuErrorFlyout'
import { buySell } from 'data/components/actions'
import { CARD_ERROR_CODE, FORM_BS_PREVIEW_SELL } from 'data/components/buySell/model'
import {
  getBSCard,
  getBSMobilePaymentMethod,
  getBSOrder,
  getBSProviderDetails
} from 'data/components/buySell/selectors'
import { useRemote } from 'hooks'
import { isNabuError } from 'services/errors'

import Loading from './template.loading'
import Success from './template.success'

const ThreeDSHandlerCheckoutDotCom = () => {
  const [polling, setPolling] = useState(false)

  const mobilePaymentMethod = useSelector(getBSMobilePaymentMethod)

  const {
    data: orderData,
    error: orderError,
    hasData: orderHasData,
    isLoading: orderLoading,
    isNotAsked: orderNotAsked
  } = useRemote(getBSOrder)

  const {
    data: cardData,
    error: cardError,
    hasData: cardHasData,
    isLoading: cardLoading,
    isNotAsked: cardNotAsked
  } = useRemote(getBSCard)

  const {
    data: providerData,
    error: providerError,
    isLoading: providerLoading
  } = useRemote(getBSProviderDetails)

  const dispatch = useDispatch()

  const handlePostMessage = ({ data }: { data: { payment: 'SUCCESS' } }) => {
    if (data.payment !== 'SUCCESS') return

    setPolling(true)

    if (orderHasData && orderData) {
      dispatch(buySell.pollOrder({ orderId: orderData.id, waitUntilSettled: true }))
    } else if (cardHasData && cardData) {
      dispatch(buySell.pollCard(cardData.id))
    }
  }

  const handleBack = useCallback(() => {
    if (orderData) {
      dispatch(
        buySell.proceedToBuyConfirmation({
          mobilePaymentMethod,
          paymentMethodId: orderData.paymentMethodId,
          paymentType: orderData.paymentType
        })
      )
    } else {
      dispatch(buySell.setStep({ step: 'DETERMINE_CARD_PROVIDER' }))
    }
  }, [orderData?.id, mobilePaymentMethod])

  const handleReset = useCallback(() => {
    dispatch(buySell.destroyCheckout())

    dispatch(clearSubmitErrors(FORM_BS_PREVIEW_SELL))
  }, [dispatch])

  const handleRetry = useCallback(() => {
    dispatch(buySell.setStep({ step: 'DETERMINE_CARD_PROVIDER' }))
  }, [])

  useEffect(() => {
    window.addEventListener('message', handlePostMessage, false)

    return () => window.removeEventListener('message', handlePostMessage, false)
  })

  const renderError = useCallback(
    (error: unknown) => {
      if (isNabuError(error)) {
        return <GenericNabuErrorFlyout error={error} onDismiss={handleBack} />
      }

      return (
        <BaseError
          code={error}
          handleReset={handleReset}
          handleBack={handleBack}
          handleRetry={handleRetry}
        />
      )
    },
    [handleReset, handleBack, handleRetry]
  )

  if (orderError) {
    return renderError(orderError)
  }

  if (cardError) {
    return renderError(cardError)
  }

  if (providerError) {
    return renderError(providerError)
  }

  if (orderLoading || cardLoading) {
    return <Loading />
  }

  if (orderNotAsked && cardNotAsked) {
    return <Loading />
  }

  if (polling) {
    return <Loading polling order={orderHasData} />
  }

  let paymentLink = ''

  if (orderData?.attributes?.cardProvider?.cardAcquirerName === 'CHECKOUTDOTCOM') {
    paymentLink = encodeURIComponent(orderData?.attributes?.cardProvider.paymentLink)
  } else if (orderData?.attributes?.cardCassy?.cardAcquirerName === 'CHECKOUTDOTCOM') {
    paymentLink = encodeURIComponent(orderData?.attributes?.cardCassy.paymentLink)
  } else if (providerData) {
    paymentLink = encodeURIComponent(providerData.cardProvider.paymentLink)
  } else if (!providerLoading && !orderLoading) {
    return (
      <BaseError
        code={CARD_ERROR_CODE.CREATE_FAILED}
        handleReset={handleReset}
        handleBack={handleBack}
        handleRetry={handleRetry}
      />
    )
  }

  if (!paymentLink) {
    return <Loading />
  }

  return <Success handleBack={handleBack} paymentLink={paymentLink} />
}

export default ThreeDSHandlerCheckoutDotCom
