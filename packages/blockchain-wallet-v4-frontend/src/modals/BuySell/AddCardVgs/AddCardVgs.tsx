import React, { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'

import { BSPairType } from '@core/types'
import { actions, selectors } from 'data'
import { FORMS_BS_BILLING_ADDRESS } from 'data/components/buySell/model'
import { BSBillingAddressFormValuesType } from 'data/types'
import { useRemote } from 'hooks'

import { Loading, LoadingTextEnum } from '../../components'
import { ADD_CARD_ERROR, IFRAME_ACTION } from '../AddCardCheckoutDotCom/model'
import Success from '../AddCardCheckoutDotCom/template.success'
import { getData } from './selectors'
import { VgsComponent } from './types'

const AddCardVgs: VgsComponent = ({ handleClose }) => {
  const dispatch = useDispatch()
  const buySellActions = bindActionCreators(actions.components.buySell, dispatch)
  const ref = useRef<HTMLIFrameElement>(null)
  const { data, error, isLoading, isNotAsked } = useRemote(getData)
  const { cardTokenId, vgsVaultId } = useSelector(selectors.components.buySell.getVgsAddCardInfo)
  const formValues = useSelector(
    selectors.form.getFormValues(FORMS_BS_BILLING_ADDRESS)
  ) as BSBillingAddressFormValuesType

  const handleReceivedPostMessage = useCallback(
    async ({
      data: eventData
    }: {
      data:
        | {
            action: IFRAME_ACTION.ADD_CARD
            provider: 'VGS'
            status: 'ERROR' | 'SUCCESS'
            token?: string
          }
        | {
            action: IFRAME_ACTION.REQUEST_BILLING_ADDRESS
            provider: 'VGS'
          }
        | {
            action: IFRAME_ACTION.CHANGE_BILLING_ADDRESS
            provider: 'VGS'
          }
        | {
            action: IFRAME_ACTION.ADD_CVV
            cvv: string
            provider: 'VGS'
          }
        | {
            action: IFRAME_ACTION.BIN_CHANGED
            bin: string
            provider: 'VGS'
            scheme: string
          }
        | {
            action: IFRAME_ACTION.DEEP_LINK
            provider: 'VGS'
            url: string
          }
    }) => {
      if (eventData.provider !== 'VGS') return

      if (eventData.action === IFRAME_ACTION.ADD_CVV) {
        if (!eventData.cvv) throw new Error(ADD_CARD_ERROR.NO_CVV)

        // setCVV(data.cvv)
      }

      if (eventData.action === IFRAME_ACTION.REQUEST_BILLING_ADDRESS) {
        ref.current?.contentWindow?.postMessage(
          { messageData: formValues || data?.userData.address, method: 'billingAddress' },
          '*'
        )
      }

      if (eventData.action === IFRAME_ACTION.CHANGE_BILLING_ADDRESS) {
        buySellActions.setStep({ step: 'BILLING_ADDRESS' })
      }

      if (eventData.action === IFRAME_ACTION.ADD_CARD) {
        if (!eventData.status) throw new Error(ADD_CARD_ERROR.NO_STATUS)

        if (eventData.status === 'ERROR') {
          // setErrorOnTokenization(true)
        }

        if (eventData.status === 'SUCCESS') {
          // const paymentMethodTokens = props.checkoutDotComAccountCodes?.reduce((prev, curr) => {
          //   if (!eventData.token) return prev
          //   return {
          //     ...prev,
          //     [curr]: eventData.token
          //   }
          // }, {})
          // if (!paymentMethodTokens) throw new Error(ADD_CARD_ERROR.NO_PAYMENT_METHOD_TOKENS)
          // if (!cvv) throw new Error(ADD_CARD_ERROR.NO_CVV)
          // buySellActions.registerCard({ cvv, paymentMethodTokens })
        }
      }

      if (eventData.action === IFRAME_ACTION.BIN_CHANGED) {
        if (!eventData.bin) throw new Error(ADD_CARD_ERROR.NO_BIN)
        if (!eventData.scheme) throw new Error(ADD_CARD_ERROR.NO_SCHEME)

        buySellActions.checkCardSuccessRate({ bin: eventData.bin, scheme: eventData.scheme })
      }

      if (eventData.action === IFRAME_ACTION.DEEP_LINK) {
        if (!eventData.url) throw new Error(ADD_CARD_ERROR.NO_DEEP_LINK_URL)

        // onClickDeepLink(data.url)
      }
    },
    [buySellActions]
  )

  useEffect(() => {
    window.addEventListener('message', handleReceivedPostMessage, false)

    return () => window.removeEventListener('message', handleReceivedPostMessage, false)
  }, [handleReceivedPostMessage])

  if (error) return null
  if (!data || isLoading || isNotAsked) return <Loading text={LoadingTextEnum.GETTING_READY} />
  if (!data) return null

  return (
    <Success
      pair={data.pair || (`${data.fiatCurrency}-${data.cryptoCurrency}` as unknown as BSPairType)}
      handleClose={handleClose}
      cryptoCurrency={data.cryptoCurrency}
      fiatCurrency={data.fiatCurrency}
      buySellActions={buySellActions}
      domain={`${data.walletHelperDomain}/wallet-helper/vgs/#/add-card/${vgsVaultId}/${cardTokenId}/${data.appEnv}`}
      iframeRef={ref}
    />
  )
}

export default AddCardVgs
