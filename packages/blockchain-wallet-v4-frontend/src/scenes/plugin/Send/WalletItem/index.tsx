import React from 'react'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import CryptoAddress from 'components/CryptoAddress/CryptoAddress'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background: ${(props) => props.theme.exchangeLogin};
  }
`

const Label = styled(Text)`
  margin: 16px 0;
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  color: ${(props) => props.theme.white};
`

type WalletItemProps = {
  address: string
  chooseAddress: (address: string) => void
}

const WalletItem: React.FC<WalletItemProps> = ({ address, chooseAddress }) => {
  return (
    <Wrapper onClick={() => chooseAddress(address)}>
      <Icon size='24px' name='ETH' />
      <Label>
        <CryptoAddress>{address}</CryptoAddress>
      </Label>
    </Wrapper>
  )
}

export default WalletItem
