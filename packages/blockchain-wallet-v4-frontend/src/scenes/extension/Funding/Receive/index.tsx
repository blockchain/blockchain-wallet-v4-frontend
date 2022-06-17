import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button } from '@blockchain-com/constellation'
import QRCodeReact from 'qrcode.react'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

import { RootState } from '../../../../data/rootReducer'

export const ReceiveHeading = styled(Text)`
  font-size: 20px;
  margin: 34px 0 12px;
  color: white;
`
const QrCodeWrapper = styled.div`
  margin: 46px 0 40px;
  display: flex;
  gap: 24px;
  justify-content: center;
  align-items: center;
`

const WalletAddressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  flex-wrap: nowrap;
`
const WalletAddress = styled(Text)`
  font-size: 16px;
  line-height: 21px;
  font-weight: 500;
  color: white;
  overflow-wrap: anywhere;
`

const CopyButton = styled(Button)`
  min-width: 62px;
  padding: 5px 8px;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  background: #0c6cf2;
  border: none;
  border-radius: 8px;
  cursor: copy;
`
const GoBackWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  flex-grow: 1;
`
const GoBack = styled(Link)`
  width: 100%;
  padding: 16px;
  background: #0c6cf2;
  border-radius: 8px;
  color: #0e121b;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  text-decoration: none;
  cursor: pointer;
`
const InlineLink = styled.a`
  color: #0c6cf2;
  text-decoration: none;
`

export const Receive = () => {
  // @ts-ignore
  const address = useSelector((state: RootState) => state.dataPath.eth.addresses.data)
  const [isCoppied, setIsCoppied] = useState<boolean>(false)

  /** Copies wallet addres into clipboard */
  const copyAddress = () => {
    navigator.clipboard.writeText(Object.keys(address)[0])
    setIsCoppied(true)
  }

  return (
    <>
      <ReceiveHeading>Receive</ReceiveHeading>
      <Text size='14px' weight={500} lineHeight='21px'>
        This wallet supports tokens and NFTs
      </Text>
      <QrCodeWrapper>
        <QRCodeReact value={Object.keys(address)[0]} size={104} />
        <WalletAddressWrapper>
          <WalletAddress>{Object.keys(address)[0]}</WalletAddress>
          <CopyButton onClick={copyAddress}>{isCoppied ? 'Coppied' : 'Copy'}</CopyButton>
        </WalletAddressWrapper>
      </QrCodeWrapper>
      <Text size='12px' lineHeight='18px' weight={500}>
        By depositing tokens to this address, you agree to our{' '}
        <InlineLink href=''>terms of service</InlineLink>. Depositing tokens other than ETH to this
        address may result in your funds being lost. See all{' '}
        <InlineLink href=''>compatible tokens</InlineLink> with this wallet.
      </Text>
      <GoBackWrapper>
        <GoBack to='/extension/home'>Go back</GoBack>
      </GoBackWrapper>
    </>
  )
}
