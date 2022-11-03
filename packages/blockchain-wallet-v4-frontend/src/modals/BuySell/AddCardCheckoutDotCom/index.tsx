import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from '@core'
import { BSPairType, CoinType, OrderType, WalletOptionsType } from '@core/types'
import BaseError from 'components/BuySell/Error'
import { GenericNabuErrorFlyout } from 'components/GenericNabuErrorFlyout'
import { actions, selectors } from 'data'
import { CARD_ERROR_CODE } from 'data/components/buySell/model'
import { RootState } from 'data/rootReducer'
import { useRemote } from 'hooks'
import { useDeepLink } from 'services/deepLinkListener'
import { isNabuError } from 'services/errors'

import { ADD_CARD_ERROR, IFRAME_ACTION } from './model'
import { getData } from './selectors'
import Success from './template.success'
import Unsupported from './template.unsupported'

const AddCardCheckoutDotCom = (props: Props) => {
  const ref = useRef<HTMLIFrameElement>(null)
  const { onClickDeepLink } = useDeepLink()
  const [errorOnTokenization, setErrorOnTokenization] = useState(false)
  const [cvv, setCVV] = useState('')
  const { error: cardError } = useRemote(() => props.cardRemote)

  const handleReceivedPostMessage = useCallback(
    async ({
      data
    }: {
      data:
        | {
            action: IFRAME_ACTION.ADD_CARD
            provider: 'CHECKOUTDOTCOM'
            status: 'ERROR' | 'SUCCESS'
            token?: string
          }
        | {
            action: IFRAME_ACTION.CHANGE_BILLING_ADDRESS
            provider: 'CHECKOUTDOTCOM'
          }
        | {
            action: IFRAME_ACTION.ADD_CVV
            cvv: string
            provider: 'CHECKOUTDOTCOM'
          }
        | {
            action: IFRAME_ACTION.BIN_CHANGED
            bin: string
            provider: 'CHECKOUTDOTCOM'
            scheme: string
          }
        | {
            action: IFRAME_ACTION.DEEP_LINK
            provider: 'CHECKOUTDOTCOM'
            url: string
          }
    }) => {
      if (data.provider !== 'CHECKOUTDOTCOM') return

      if (data.action === IFRAME_ACTION.ADD_CVV) {
        if (!data.cvv) throw new Error(ADD_CARD_ERROR.NO_CVV)

        setCVV(data.cvv)
      }

      if (data.action === IFRAME_ACTION.CHANGE_BILLING_ADDRESS) {
        props.buySellActions.setStep({ step: 'BILLING_ADDRESS' })
      }

      if (data.action === IFRAME_ACTION.ADD_CARD) {
        if (!data.status) throw new Error(ADD_CARD_ERROR.NO_STATUS)

        if (data.status === 'ERROR') {
          setErrorOnTokenization(true)
        }

        if (data.status === 'SUCCESS') {
          const paymentMethodTokens = props.checkoutDotComAccountCodes?.reduce((prev, curr) => {
            if (!data.token) return prev

            return {
              ...prev,
              [curr]: data.token
            }
          }, {})

          if (!paymentMethodTokens) throw new Error(ADD_CARD_ERROR.NO_PAYMENT_METHOD_TOKENS)

          if (!cvv) throw new Error(ADD_CARD_ERROR.NO_CVV)

          props.buySellActions.registerCard({ cvv, paymentMethodTokens })
        }
      }

      if (data.action === IFRAME_ACTION.BIN_CHANGED) {
        if (!data.bin) throw new Error(ADD_CARD_ERROR.NO_BIN)
        if (!data.scheme) throw new Error(ADD_CARD_ERROR.NO_SCHEME)

        props.buySellActions.checkCardSuccessRate({ bin: data.bin, scheme: data.scheme })
      }

      if (data.action === IFRAME_ACTION.DEEP_LINK) {
        if (!data.url) throw new Error(ADD_CARD_ERROR.NO_DEEP_LINK_URL)

        onClickDeepLink(data.url)
      }
    },
    [cvv, onClickDeepLink, props.buySellActions, props.checkoutDotComAccountCodes]
  )

  const handleAction = () => {
    props.buySellActions.destroyCheckout()
  }

  useEffect(() => {
    window.addEventListener('message', handleReceivedPostMessage, false)

    return () => window.removeEventListener('message', handleReceivedPostMessage, false)
  }, [handleReceivedPostMessage])

  useEffect(() => {
    if (!props.cardSuccessRate) return

    if (!ref.current?.contentWindow) {
      return
    }

    ref.current.contentWindow.postMessage(
      { ...props.cardSuccessRate, provider: 'BLOCKCHAINDOTCOM' },
      '*'
    )
  }, [props.cardSuccessRate])

  useEffect(() => {
    if (props.fiatCurrency && !Remote.Success.is(props.data)) {
      props.buySellActions.fetchFiatEligible(props.fiatCurrency)
    }

    if (props.fiatCurrency) {
      props.buySellActions.fetchPaymentMethods(props.fiatCurrency)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (cardError && isNabuError(cardError)) {
    return (
      <GenericNabuErrorFlyout
        error={cardError}
        onDismiss={() => props.buySellActions.createCardNotAsked()}
      />
    )
  }

  if (errorOnTokenization) {
    return (
      <BaseError
        code={CARD_ERROR_CODE.CREATE_FAILED}
        handleRetry={handleAction}
        handleReset={handleAction}
        handleBack={handleAction}
      />
    )
  }

  return props.data.cata({
    Failure: (e) => {
      if (isNabuError(e)) {
        return <GenericNabuErrorFlyout error={e} onDismiss={handleAction} />
      }

      return (
        <BaseError
          code={e}
          handleRetry={handleAction}
          handleReset={handleAction}
          handleBack={handleAction}
        />
      )
    },
    Loading: () => null,
    NotAsked: () => null,
    Success: (val) => {
      const isUserEligible =
        val.paymentMethods.methods.length &&
        val.paymentMethods.methods.find(
          (method) =>
            method.limits?.max !== '0' && method.currency === props.fiatCurrency && method.eligible
        )

      return isUserEligible ? (
        <Success
          {...props}
          {...val}
          domain={`${props.domains.walletHelper}/wallet-helper/checkoutdotcom/#/add-card/${props.checkoutDotComApiKey}`}
          iframeRef={ref}
        />
      ) : (
        <Unsupported
          handleClose={props.handleClose}
          paymentAccountEligible={val.eligibility?.eligible}
          fiatCurrency={props.fiatCurrency}
          orderType={props.orderType || OrderType.BUY}
        />
      )
    }
  })
}

const mapStateToProps = (state: RootState) => ({
  cardRemote: selectors.components.buySell.getBSCard(state),
  cardSuccessRate: selectors.components.buySell.getCardSuccessRate(state),
  checkoutDotComAccountCodes: selectors.components.buySell.getCheckoutAccountCodes(state),
  checkoutDotComApiKey: selectors.components.buySell.getCheckoutApiKey(state),
  countryCode: selectors.core.settings.getCountryCode(state).getOrElse(null),
  data: getData(state),
  domains: selectors.core.walletOptions.getDomains(state).getOrElse({
    walletHelper: 'https://wallet-helper.blockchain.com'
  } as WalletOptionsType['domains']),
  fiatCurrency: selectors.components.buySell.getFiatCurrency(state) || 'USD',
  orderType: selectors.components.buySell.getOrderType(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  cryptoCurrency?: CoinType
  handleClose: () => void
  pair: BSPairType
}

export type SuccessStateType = ReturnType<typeof getData>['data']

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(AddCardCheckoutDotCom)
