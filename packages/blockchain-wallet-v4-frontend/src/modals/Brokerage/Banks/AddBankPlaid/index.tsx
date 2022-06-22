import React, { PureComponent, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { connect, ConnectedProps, useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import styled from 'styled-components'

import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { AddBankStepType, BankPartners, ModalName } from 'data/types'
import { useRemote } from 'hooks'
import ModalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../../types'

const FullScreenModal = styled.div`
  background-color: rgb(18 29 51 / 5%);
  transition: background-color 0.5s ease-in-out;
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 9999999;

  &.active {
    background-color: #121d33;
  }
`

const Iframe = styled.iframe`
  border: 0;
  height: 100%;
  width: 100%;
`

const Success: React.FC<ModalPropsType> = ({ close }: ModalPropsType) => {
  const dispatch = useDispatch()
  const [showing, setShowing] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setShowing(true)
    }, 1000)
  })

  const handlePostMessage = (event: MessageEvent) => {
    if (event.data.from !== 'plaid') return
    if (event.data.to !== 'sb') return

    const { error, metadata, public_token } = event.data
    if (error) throw new Error(error)
    if (!public_token) {
      setShowing(false)
      return setTimeout(() => {
        close()
      }, 200)
    }

    dispatch(
      actions.components.brokerage.fetchBankTransferUpdate({
        account_id: metadata.account_id,
        public_token
      })
    )
    dispatch(actions.components.buySell.setStep({ step: 'LOADING' }))
    close()
  }

  useEffect(() => {
    window.addEventListener('message', handlePostMessage, false)

    return () => {
      window.removeEventListener('message', handlePostMessage, false)
    }
  }, [])

  const iFrameUrl = useSelector(selectors.components.brokerage.getPlaidWalletHelperLink)
  const { data, error, hasError } = useRemote(selectors.components.brokerage.getBankCredentials)

  if (hasError) return <>I has an error {error}</>
  if (!data) return <>No Data Yet</>
  if (data.partner !== BankPartners.PLAID) return null

  return (
    <FullScreenModal className={showing ? 'active' : ''}>
      <Iframe src={`${iFrameUrl}#/token/${data.attributes.link_token}`} />
    </FullScreenModal>
  )
}

const mapStateToProps = (state: RootState) => ({
  step: selectors.components.brokerage.getAddBankStep(state)
})

const connector = connect(mapStateToProps)

const enhance = compose(
  ModalEnhancer(ModalName.ADD_BANK_PLAID_MODAL, { transition: duration }),
  connector
)

type OwnProps = ModalPropsType
type LinkStatePropsType = {
  step: AddBankStepType
}

export type Props = OwnProps & LinkStatePropsType & ConnectedProps<typeof connector>

export default enhance(Success)
