import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'

import { BSPairType } from '@core/types'
import BaseError from 'components/BuySell/Error'
import { actions, selectors } from 'data'
import { CARD_ERROR_CODE, FORMS_BS_BILLING_ADDRESS } from 'data/components/buySell/model'
import { BSBillingAddressFormValuesType } from 'data/types'
import { useRemote } from 'hooks'

import { Loading, LoadingTextEnum } from '../../components'
import { ADD_CARD_ERROR, IFRAME_ACTION } from '../AddCardCheckoutDotCom/model'
import Success from '../AddCardCheckoutDotCom/template.success'
import CardLoading from '../ThreeDSHandlerCheckoutDotCom/template.loading'
import { getData } from './selectors'
import { ReceiveMessageProps, VgsComponent } from './types'

const AddCardVgs: VgsComponent = ({ handleClose }) => {
  const dispatch = useDispatch()
  const buySellActions = bindActionCreators(actions.components.buySell, dispatch)

  const [isPolling, setPolling] = useState(false)
  const [errorOnTokenization, setErrorOnTokenization] = useState(false)

  const ref = useRef<HTMLIFrameElement>(null)

  const { data, error, isLoading, isNotAsked } = useRemote(getData)
  const { cardTokenId, vgsVaultId } = useSelector(selectors.components.buySell.getVgsAddCardInfo)
  const cardSuccessRate = useSelector(selectors.components.buySell.getCardSuccessRate)
  const formValues = useSelector(
    selectors.form.getFormValues(FORMS_BS_BILLING_ADDRESS)
  ) as BSBillingAddressFormValuesType

  const handleReceivedPostMessage = useCallback(
    async ({ data: eventData }: ReceiveMessageProps) => {
      if (eventData.provider !== 'VGS') return

      if (eventData.action === IFRAME_ACTION.REQUEST_BILLING_ADDRESS) {
        const address = formValues || data?.userData.address
        // FIXME: due to a recent change on the backend `country` is no longer supported in favor of `countryCode`
        //        but not supported everywhere yet so need to keep `country` for now.
        address.countryCode = address.country
        address.state = address.state || ''

        ref.current?.contentWindow?.postMessage(
          { messageData: address, method: 'billingAddress' },
          '*'
        )
      }

      if (eventData.action === IFRAME_ACTION.CHANGE_BILLING_ADDRESS) {
        buySellActions.setStep({ step: 'BILLING_ADDRESS' })
      }

      if (eventData.action === IFRAME_ACTION.ADD_CARD) {
        if (!eventData.status) throw new Error(ADD_CARD_ERROR.NO_STATUS)

        if (eventData.status === 'ERROR') {
          setErrorOnTokenization(true)
        }

        if (eventData.status === 'SUCCESS') {
          if (!eventData.token) throw new Error(ADD_CARD_ERROR.NO_PAYMENT_METHOD_TOKENS)
          setPolling(true)
          buySellActions.pollCard(eventData.token)
        }
      }

      if (eventData.action === IFRAME_ACTION.BIN_CHANGED) {
        if (!eventData.bin) throw new Error(ADD_CARD_ERROR.NO_BIN)

        buySellActions.checkCardSuccessRate({ bin: eventData.bin })
      }
    },
    []
  )

  const handleAction = () => {
    buySellActions.destroyCheckout()
  }

  useEffect(() => {
    if (!cardSuccessRate || !ref.current?.contentWindow) {
      return
    }

    ref.current.contentWindow.postMessage({ ...cardSuccessRate, provider: 'BLOCKCHAINDOTCOM' }, '*')
  }, [cardSuccessRate])

  useEffect(() => {
    window.addEventListener('message', handleReceivedPostMessage, false)

    return () => window.removeEventListener('message', handleReceivedPostMessage, false)
  }, [])

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
  if (isPolling) return <CardLoading polling />
  if (error) return null
  if (!data || isLoading || isNotAsked) return <Loading text={LoadingTextEnum.GETTING_READY} />

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
