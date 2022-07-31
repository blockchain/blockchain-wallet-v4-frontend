import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { FlyoutWrapper } from 'components/Flyout'
import { actions, selectors } from 'data'
import { AddBankStepType, BankPartners, PlaidSettlementErrorReasons } from 'data/types'
import { useRemote } from 'hooks'

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

const Success: React.FC<Props> = ({ handleClose, reason }: Props) => {
  const dispatch = useDispatch()

  useEffect(() => {
    switch (reason) {
      case 'REQUIRES_UPDATE':
        dispatch(actions.components.brokerage.fetchBankRefreshCredentials())
        break
      default:
        break
    }
  }, [reason, dispatch])

  const handlePostMessage = (event: MessageEvent) => {
    if (event.data.from !== 'plaid') return
    if (event.data.to !== 'sb') return

    const { error, metadata, public_token } = event.data
    if (error) throw new Error(error)
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

  const iFrameUrl = useSelector(selectors.components.brokerage.getPlaidWalletHelperLink)
  const { data, error, hasError } = useRemote(selectors.components.brokerage.getBankCredentials)

  if (hasError) return <>{error}</>
  if (!data || data.partner !== BankPartners.PLAID) return null

  return (
    <FullScreenModal>
      <Iframe src={`${iFrameUrl}#/token/${data.attributes.link_token}`} />
    </FullScreenModal>
  )
}

type Props = { handleClose: () => void; reason?: PlaidSettlementErrorReasons }

export default Success
