import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from '@reduxjs/toolkit'
import { AvailableCoins } from 'blockchain-wallet-v4-frontend/src/scenes/plugin/Send'
import { getData } from 'blockchain-wallet-v4-frontend/src/scenes/plugin/Send/SelectAddress/Recents/selectors'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import CryptoAddress from 'components/CryptoAddress/CryptoAddress'
import { Flex } from 'components/Flex'
import { actions } from 'data'

const Wrapper = styled(Flex)`
  flex-direction: column;
  margin-top: 50px;
`

const SubTitle = styled(Text)`
  margin: 0 0 20px;
  color: ${(props) => props.theme.grey400};
  font-style: normal;
`

const Wallets = styled(Flex)`
  flex-direction: column;
  height: 292px;
  overflow: scroll;

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.grey400};
  }

  &::-webkit-scrollbar {
    display: block;
    width: 4px;
  }

  &::-webkit-scrollbar-track,
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
`

const WallerWrapper = styled.button`
  display: flex;
  align-items: center;
  gap: 16px;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  outline: none;
  border: none;
  background: transparent;

  &:hover {
    background: ${(props) => props.theme.exchangeLogin};
  }
`

const Label = styled(Text)`
  margin: 20px 0;
`

const Recents: React.FC<Props> = (props) => {
  const {
    data: { addresses },
    ethTransactionsActions,
    selectSearchedAddress
  } = props

  useEffect(() => {
    ethTransactionsActions.initialized()
  }, [])

  return (
    <Wrapper>
      <SubTitle size='16px' lineHeight='21px' weight={500}>
        <FormattedMessage id='plugin.send.recents_title' defaultMessage='Recents' />
      </SubTitle>
      <Wallets>
        {addresses.map((address: string) => (
          <WallerWrapper key={address} onClick={() => selectSearchedAddress(address)}>
            <Icon size='24px' name={AvailableCoins.ETH} />
            <Label size='16px' lineHeight='21px' weight={600} color='white'>
              <CryptoAddress>{address}</CryptoAddress>
            </Label>
          </WallerWrapper>
        ))}
      </Wallets>
    </Wrapper>
  )
}

const mapStateToProps = (state, props) => ({
  data: getData(state, AvailableCoins.ETH, props.searchedAddress)
})

const mapDispatchToProps = (dispatch) => ({
  ethTransactionsActions: bindActionCreators(actions.components.ethTransactions, dispatch)
})

type OwnProps = {
  searchedAddress: string
  selectSearchedAddress: (address: string) => void
}

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = OwnProps & ConnectedProps<typeof connector>

export default connect(mapStateToProps, mapDispatchToProps)(Recents)
