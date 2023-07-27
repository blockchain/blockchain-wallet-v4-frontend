import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import DataError from 'components/DataError'
import { FlyoutWrapper } from 'components/Flyout'
import { GenericNabuErrorFlyout } from 'components/GenericNabuErrorFlyout'
import { actions, selectors } from 'data'
import { AddBankStepType, Analytics, BankPartners, PlaidSettlementErrorReasons } from 'data/types'
import { useRemote } from 'hooks'
import { isNabuError } from 'services/errors'

const FullScreenModal = styled(FlyoutWrapper)`
  background-color: rgb(18 29 51 / 5%);
  transition: background-color 0.5s ease-in-out;
  padding: 0;
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
`

const Iframe = styled.iframe`
  border: 0;
  height: 100%;
  width: 100%;
`

const Success: React.FC<Props> = ({ handleClose, paymentMethodId, reason }: Props) => {
  const dispatch = useDispatch()

  const iFrameUrl = useSelector(selectors.components.brokerage.getPlaidWalletHelperLink)

  const {
    data,
    error: bankCredentialError,
    hasError: hasBankCredentialError
  } = useRemote(selectors.components.brokerage.getBankCredentials)

  useEffect(() => {
    if (paymentMethodId && reason) {
      if (reason === 'REQUIRES_UPDATE') {
        dispatch(actions.components.brokerage.fetchBankRefreshCredentials(paymentMethodId))
      }
    } else {
      dispatch(actions.components.brokerage.setupBankTransferProvider())
    }
  }, [reason, dispatch, paymentMethodId])

  const handlePostMessage = (event: MessageEvent) => {
    if (event.data.from !== 'plaid') return
    if (event.data.to !== 'sb') return

    const { error: plaidError, metadata, public_token } = event.data

    if (plaidError) {
      const { error_code, error_message, error_type, event } = plaidError
      const { institution, link_session_id } = metadata

      dispatch(
        actions.analytics.trackEvent({
          key: Analytics.PLAID_ERROR,
          properties: {
            error_code,
            error_event_type: event ?? 'ON_EXIT',
            error_message,
            error_type,
            institution_id: institution.institution_id,
            institution_name: institution.name,
            link_session_id
          }
        })
      )
    }

    if (!public_token) {
      return handleClose()
    }

    // registers bank and start polling api for bank status
    dispatch(
      actions.components.brokerage.fetchBankTransferUpdate({
        account_id: metadata.account_id,
        public_token
      })
    )
    dispatch(actions.components.brokerage.setAddBankStep({ addBankStep: AddBankStepType.LOADING }))
  }

  useEffect(() => {
    window.addEventListener('message', handlePostMessage, false)

    return () => {
      window.removeEventListener('message', handlePostMessage, false)
    }
  }, [])

  if (isNabuError(bankCredentialError)) {
    return <GenericNabuErrorFlyout error={bankCredentialError} onDismiss={handleClose} />
  }
  if (hasBankCredentialError) {
    return <DataError />
  }

  if (!data || data.partner !== BankPartners.PLAID) return null

  return (
    <FullScreenModal>
      <Iframe src={`${iFrameUrl}#/token/${data.attributes.link_token}`} />
    </FullScreenModal>
  )
}

type Props = { handleClose: () => void } & (
  | { paymentMethodId: string; reason?: PlaidSettlementErrorReasons }
  | { paymentMethodId?: never; reason?: never }
)

export default Success
