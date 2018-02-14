import React from 'react'
import styled from 'styled-components'
import ReactHighcharts from 'react-highcharts'
import { FormattedMessage } from 'react-intl'
import { Color, Text } from 'blockchain-info-components'
import configure from './chart.config.js'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'

const Wrapper = styled.div`
  width: 100%;
  border: 1px solid ${props => props.theme['gray-2']};
  padding: 10px 0px;
`
const ChartInfo = styled.div`
  display: flex;
  justify-content: space-around;
  flex-direction: row;
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;
`
const ColourBar = styled.div`
  width: 100%;
  height: 5px;
  background-color: ${props => props.color};
`
const CoinBalance = styled.div`
  cursor: pointer;
`

const BalancesChart = (props) => {
  const { balances, handleCoinDisplay } = props
  const { bitcoinBalance, etherBalance, bchBalance, chartData, symbol } = balances

  return (
    <Wrapper>
      <Text uppercase>
        <FormattedMessage id='scenes.home.balanceschart.yourbalances' defaultMessage='Your Balances' />
      </Text>
      <ReactHighcharts config={configure(chartData, symbol)} isPureConfig />
      <ChartInfo>
        <Column>
          <ColourBar color={Color('brand-primary')} />
          <Text>
            <FormattedMessage id='scenes.home.balanceschart.btc' defaultMessage='Bitcoin' />
          </Text>
          <CoinBalance onClick={handleCoinDisplay}>
            <SwitchableDisplay coin='BTC'>{bitcoinBalance}</SwitchableDisplay>
          </CoinBalance>
        </Column>
        <Column>
          <ColourBar color={Color('brand-secondary')} />
          <Text>
            <FormattedMessage id='scenes.home.balanceschart.eth' defaultMessage='Ether' />
          </Text>
          <CoinBalance onClick={handleCoinDisplay}>
            <SwitchableDisplay coin='ETH'>{etherBalance}</SwitchableDisplay>
          </CoinBalance>
        </Column>
        <Column>
          <ColourBar color={Color('brand-tertiary')} />
          <Text>
            <FormattedMessage id='scenes.home.balanceschart.bch' defaultMessage='Bitcoin Cash' />
          </Text>
          <CoinBalance onClick={handleCoinDisplay}>
            <SwitchableDisplay coin='BCH'>{bchBalance}</SwitchableDisplay>
          </CoinBalance>
        </Column>
      </ChartInfo>
    </Wrapper>
  )
}

export default BalancesChart
