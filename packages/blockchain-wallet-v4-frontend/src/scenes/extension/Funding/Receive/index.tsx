import React, { useState } from 'react'
import { Button } from '@blockchain-com/constellation'
import QRCodeReact from 'qrcode.react'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

import { FundingHeading } from '../SelectAccount'

const WalletAddressWrapper = styled.div`
  margin: 53px 0 40px;
  padding: 19px 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  flex-wrap: nowrap;
  background: #20242c;
  border-radius: 16px;
`
const WalletAddress = styled(Text)`
  font-size: 14px;
  line-height: 21px;
  font-weight: 500;
  overflow-wrap: anywhere;
`

const CopyButton = styled(Button)`
  min-width: 62px;
  padding: 5px 8px;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  background: #65a5ff;
  border: none;
  border-radius: 8px;
  cursor: copy;
`

const QrCodeWrapper = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  border-color: #2c3038;
  border-style: solid;
  border-width: 0.5px 0;
`

export const Receive = () => {
  const [walletAddress, setWalletAddress] = useState<string>(
    '0xF351db55d029F4A56E744afE1adA81dad4284c1D'
  )
  const [isCoppied, setIsCoppied] = useState<boolean>(false)

  /** Copies wallet addres into clipboard */
  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
    setIsCoppied(true)
  }

  return (
    <>
      <FundingHeading>Receive tokens and NFTs</FundingHeading>
      <WalletAddressWrapper>
        <WalletAddress>{walletAddress}</WalletAddress>
        <CopyButton onClick={copyAddress}>{isCoppied ? 'Coppied' : 'Copy'}</CopyButton>
      </WalletAddressWrapper>
      <QrCodeWrapper>
        <QRCodeReact value={walletAddress} size={85} />
      </QrCodeWrapper>
      <Text size='12px' lineHeight='18px' weight={500}>
        By depositing tokens to this address, you agree to our terms of service. Depositing tokens
        other than ETH to this address may result in your funds being lost. See all compatible
        tokens with this wallet.
      </Text>
    </>
  )
}
