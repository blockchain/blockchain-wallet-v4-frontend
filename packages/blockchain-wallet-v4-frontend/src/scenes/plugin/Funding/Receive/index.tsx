import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button } from '@blockchain-com/constellation'
import QRCodeReact from 'qrcode.react'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { selectors } from 'data'

export const ReceiveHeading = styled(Text)`
  font-size: 20px;
  margin: 34px 0 12px;
  color: ${(props) => props.theme.white};
`
const QrCodeWrapper = styled.div`
  margin: 107px 0 40px;
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
  color: ${(props) => props.theme.white};
  overflow-wrap: anywhere;
`

const CopyButton = styled(Button)`
  min-width: 62px;
  padding: 5px 8px;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  background: ${(props) => props.theme.white};
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
  background: ${(props) => props.theme.white};
  border-radius: 8px;
  color: ${(props) => props.theme.exchangeLogin};
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  text-decoration: none;
  cursor: pointer;
`
const InlineLink = styled.a`
  color: ${(props) => props.theme.blue600};
  text-decoration: none;
`

const Receive = (props) => {
  const selectedAccount = useSelector((state) => selectors.cache.getCache(state).selectedAccount)
  const [walletAddress, setWalletAddress] = useState('')
  const [isCoppied, setIsCoppied] = useState<boolean>(false)

  /** Copies wallet addres into clipboard */
  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
    setIsCoppied(true)
  }

  useEffect(() => {
    if (selectedAccount && selectedAccount[0]) {
      setWalletAddress(selectedAccount[0].address)
    }
  }, [selectedAccount])

  return (
    <>
      <ReceiveHeading>Receive</ReceiveHeading>
      <Text size='14px' weight={500} lineHeight='21px'>
        This wallet supports tokens and NFTs. See{' '}
        <InlineLink
          target='_blank'
          href='https://support.blockchain.com/hc/en-us/articles/360045140832-What-cryptocurrencies-are-supported-for-transacting-in-the-Blockchain-com-Wallet-'
          rel='noopener noreferrer'
        >
          all compatible assets
        </InlineLink>{' '}
        with this address
      </Text>
      <QrCodeWrapper>
        <QRCodeReact value={walletAddress} size={104} />
        <WalletAddressWrapper>
          <WalletAddress>{walletAddress}</WalletAddress>
          <CopyButton onClick={copyAddress}>{isCoppied ? 'Coppied' : 'Copy'}</CopyButton>
        </WalletAddressWrapper>
      </QrCodeWrapper>
      <GoBackWrapper>
        <GoBack to='/plugin/coinslist'>
          <FormattedMessage id='buttons.go_back' defaultMessage='Go back' />
        </GoBack>
      </GoBackWrapper>
    </>
  )
}

export default Receive
