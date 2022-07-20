import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Flex } from 'components/Flex'
import { actions, selectors } from 'data'

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  margin: 0 auto;
  background: transparent;
  padding: 16px 0;
  width: 326px;
  border-radius: 8px;
  cursor: pointer;
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
      <Flex alignItems='center' justifyContent='flex-start'>
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
  balance: selectors.balances.getCoinTotalBalance(props.coin)(state).getOrElse(0)
})

const mapDispatchToProps = (dispatch) => ({
  sendActions: bindActionCreators(actions.components.sendEth, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type AssetProps = {
  coin: string
  selectCoin: (coin: string) => void
}

type Props = AssetProps & ConnectedProps<typeof connector>

export default connect(mapStateToProps, mapDispatchToProps)(Asset)
