import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { Icon } from '@blockchain-com/constellation'
import { IconMoreHorizontal } from '@blockchain-com/icons'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { selectors } from 'data'

import DefaultHeader from '../DefaultHeader'

const WalletAddress = styled.div`
  display: flex;
  align-items: center;
  background-color: ${(p) => p.theme.grey800};
  color: ${(p) => p.theme.grey400};
  border-radius: 8px;
  padding: 3px 5px 3px 10px;
  font-size: 12px;
`

const WalletSymbol = styled.div`
  background-color: ${(p) => p.theme.exchangeLogin};
  color: ${(p) => p.theme.grey400};
  padding: 3px 10px;
  border-radius: 8px;
  margin-left: 10px;
  display: flex;
  align-items: center;

  span {
    margin-left: 5px;
    width: 6px;
    height: 6px;
    display: block;
    border-radius: 50%;
    background: ${(p) => p.theme.white};
  }
`

const CoinsListHeader = (props) => {
  return (
    <DefaultHeader
      suffix={
        <Icon label='icon-more'>
          <IconMoreHorizontal />
        </Icon>
      }
    >
      <WalletAddress>
        <Text size='12px' color='grey600'>
          <FormattedMessage id='plugin.privateKeyWallet' defaultMessage='Private Key Wallet' />
        </Text>
        <WalletSymbol>
          <Text size='12px'>ETH</Text>
          <span />
        </WalletSymbol>
      </WalletAddress>
    </DefaultHeader>
  )
}

const mapStateToProps = (state) => ({
  walletAddress: selectors.core.kvStore.eth.getDefaultAddress(state).getOrElse('')
})

export default connect(mapStateToProps)(CoinsListHeader)
