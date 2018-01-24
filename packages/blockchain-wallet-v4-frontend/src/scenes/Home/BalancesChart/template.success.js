import React from 'react'
import styled from 'styled-components'
import ReactHighcharts from 'react-highcharts'
import { FormattedMessage } from 'react-intl'
import { Color, Text } from 'blockchain-info-components'
import configure from './chart.config.js'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'

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

const BalancesChart = (props) => {
  const { bitcoinBalance, etherBalance, chartData } = props.balances

  return (
    <Wrapper>
      <Text uppercase>
        <FormattedMessage id='scenes.home.balanceschart.yourbalances' defaultMessage='Your Balances' />
      </Text>
      <ReactHighcharts config={configure(chartData)} isPureConfig />
      <ChartInfo>
        <Column>
          <ColourBar color={Color('brand-primary')} />
          <Text>
            <FormattedMessage id='scenes.home.balanceschart.btc' defaultMessage='Bitcoin' />
          </Text>
          <CoinDisplay coin='BTC'>{bitcoinBalance}</CoinDisplay>
        </Column>
        <Column>
          <ColourBar color={Color('brand-secondary')} />
          <Text>
            <FormattedMessage id='scenes.home.balanceschart.eth' defaultMessage='Ether' />
          </Text>
          <CoinDisplay coin='ETH'>{etherBalance}</CoinDisplay>
        </Column>
        <Column>
          <ColourBar color={Color('brand-tertiary')} />
          <Text>
            <FormattedMessage id='scenes.home.balanceschart.bch' defaultMessage='Bitcoin Cash' />
          </Text>
        </Column>
      </ChartInfo>
    </Wrapper>
  )
}

export default BalancesChart
