import React, { PureComponent, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { connect, ConnectedProps, useSelector } from 'react-redux'
import { compose } from 'redux'
import styled from 'styled-components'

import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { AddBankStepType, BankPartners, ModalName } from 'data/types'
import { useRemote } from 'hooks'
import ModalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../../types'

const Iframe = styled.iframe`
  border: 0;
  height: 100%;
  width: 100%;
`

const Success: React.FC<ModalPropsType> = ({ close, position, total }: ModalPropsType) => {
  const handlePostMessage = (event: MessageEvent) => {
    if (event.data.from !== 'plaid') return
    if (event.data.to !== 'sb') return

    const { metadata, public_token } = event.data
    if (!public_token) return close()
  }

  useEffect(() => {
    window.addEventListener('message', handlePostMessage, false)

    return () => {
      window.removeEventListener('message', handlePostMessage, false)
    }
  }, [])

  const {
    data: { api }
  } = useSelector(selectors.core.walletOptions.getDomains)
  const iFrameUrl = useSelector(selectors.components.brokerage.getPlaidWalletHelperLink)
  const { data, error, hasError } = useRemote(selectors.components.brokerage.getBankCredentials)

  if (hasError) return <>I has an error {error}</>
  if (!data) return <>No Data Yet</>
  if (data.partner !== BankPartners.PLAID) return null

  return (
    <div style={{ bottom: 0, left: 0, position: 'absolute', right: 0, top: 0, zIndex: 9999999 }}>
      <Iframe src={`${iFrameUrl}#/token/${data.attributes.link_token}`} />
    </div>
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
