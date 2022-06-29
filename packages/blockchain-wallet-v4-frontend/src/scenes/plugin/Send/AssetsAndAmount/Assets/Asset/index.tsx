import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { getBalanceSelector } from 'components/Balances/selectors'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Flex } from 'components/Flex'

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  margin: 0 auto;
  background: transparent;
  width: 90%;
  padding: 10px 5px;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background: ${(props) => props.theme.exchangeLogin};
  }
`

const CurrencyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  width: 160px;
`

const PriceWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 10px;
`

const Asset: React.FC<Props> = (props) => {
  const { balance, coin, selectCoin } = props
  const { coinfig } = window.coins[coin]

  // chooses active coin
  const chooseCoin = () => {
    selectCoin(coin)
  }

  return (
    <Wrapper onClick={chooseCoin}>
      <Flex alignItems='center' justifyContent='center'>
        <Icon size='24px' name={coinfig.symbol} />
      </Flex>
      <PriceWrapper>
        <Text color='white'>{coinfig.name}</Text>
        <Text color='grey400'>{coin}</Text>
      </PriceWrapper>
      <CurrencyWrapper>
        <CoinDisplay
          weight={600}
          size='14px'
          lineHeight='24px'
          color='white'
          coin={coin}
          hideCoinTicker
        >
          {balance}
        </CoinDisplay>
        <FiatDisplay weight={500} size='12px' lineHeight='18px' color='grey400' coin={coin}>
          {balance}
        </FiatDisplay>
      </CurrencyWrapper>
    </Wrapper>
  )
}

const mapStateToProps = (state, props) => ({
  balance: getBalanceSelector(props.coin)(state).getOrElse(0)
})

const connector = connect(mapStateToProps)

type AssetProps = {
  coin: string
  selectCoin: (coin: string) => void
}

type Props = AssetProps & ConnectedProps<typeof connector>

export default connector(Asset)
