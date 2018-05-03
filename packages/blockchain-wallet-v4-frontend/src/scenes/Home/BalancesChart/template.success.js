import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import ReactHighcharts from 'react-highcharts'
import { FormattedMessage } from 'react-intl'
import { Color, Text, Link } from 'blockchain-info-components'
import configure from './chart.config.js'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'

const Wrapper = styled.div`
  width: 100%;
  height: 400px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  justify-content: space-between;
  border: 1px solid ${props => props.theme['gray-1']};
  svg {
    font-weight: 300;
    font-family: 'Montserrat' !important;
  }
  @media(min-width: 480px) {
    height: 380px;
  }
`
const ChartInfo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 25%;
  > * { margin-bottom: 4px; }
`
const ColourBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${props => props.color};
`
const CoinBalance = styled.div`
  cursor: pointer;
  font-size: 14px;
`
const ViewAllText = styled(Text)`
  color: ${props => props.theme['brand-secondary']};
  text-decoration-color: ${props => props.theme['brand-secondary']};
  cursor: pointer;
`
const WalletLink = styled(NavLink)`
  cursor: pointer;
  color: ${props => props.theme['brand-secondary']};
  font-size: 10px;
  font-weight: 300;
  font-family: 'Montserrat',sans-serif;
  text-decoration: none;
`

const BalancesChart = (props) => {
  const { balances, handleCoinDisplay, history, modalsActions } = props
  const { btcBalance, ethBalance, bchBalance, chartData, symbol, btcAccountsLength, bchAccountsLength } = balances

  return (
    <Wrapper>
      <Text uppercase color='brand-primary' weight={300} size='24px'>
        <FormattedMessage id='scenes.home.balanceschart.yourbalances' defaultMessage='Your Balances' />
      </Text>
      <ReactHighcharts config={configure(chartData, symbol, history)} isPureConfig />
      <ChartInfo>
        <Column>
          <ColourBar color={Color('brand-primary')} />
          <Text size='14px' weight={300}>
            <FormattedMessage id='scenes.home.balanceschart.btc' defaultMessage='Bitcoin' />
          </Text>
          <CoinBalance onClick={handleCoinDisplay}>
            <SwitchableDisplay coin='BTC' cursor='pointer' size='14px' weight={200}>{btcBalance}</SwitchableDisplay>
          </CoinBalance>
          { btcBalance <= 0 && <WalletLink to="/buy-sell" size='10px' weight={300}>
            <FormattedMessage id='scenes.home.balanceschart.buybtc' defaultMessage='Buy Bitcoin' />
          </WalletLink> }
          {btcAccountsLength > 1 &&
            <NavLink to='/settings/addresses' style={{ textDecoration: 'none' }}>
              <ViewAllText weight={300} size='10px'>
                <FormattedMessage id='scenes.home.balanceschart.btc.viewall' defaultMessage='View All Balances' />
              </ViewAllText>
            </NavLink>
          }
        </Column>
        <Column>
          <ColourBar color={Color('brand-secondary')} />
          <Text size='14px' weight={300}>
            <FormattedMessage id='scenes.home.balanceschart.eth' defaultMessage='Ether' />
          </Text>
          <CoinBalance onClick={handleCoinDisplay}>
            <SwitchableDisplay coin='ETH' cursor='pointer' size='14px' weight={200}>{ethBalance}</SwitchableDisplay>
          </CoinBalance>
          { ethBalance <= 0 && <Link size='10px' weight={300} onClick={() => modalsActions.showModal('RequestEther')}>
            <FormattedMessage id='scenes.home.balanceschart.requesteth' defaultMessage='Request Ether' />
          </Link> }
        </Column>
        <Column>
          <ColourBar color={Color('brand-tertiary')} />
          <Text size='14px' weight={300}>
            <FormattedMessage id='scenes.home.balanceschart.bch' defaultMessage='Bitcoin Cash' />
          </Text>
          <CoinBalance onClick={handleCoinDisplay}>
            <SwitchableDisplay coin='BCH' cursor='pointer' size='14px' weight={200}>{bchBalance}</SwitchableDisplay>
          </CoinBalance>
          { bchBalance <= 0 && <Link size='10px' weight={300} onClick={() => modalsActions.showModal('RequestBch')}>
            <FormattedMessage id='scenes.home.balanceschart.requestbch' defaultMessage='Request Bitcoin Cash' />
          </Link> }
          {bchAccountsLength > 1 &&
            <NavLink to='/settings/addresses/bch' style={{ textDecoration: 'none' }}>
              <ViewAllText weight={300} size='10px'>
                <FormattedMessage id='scenes.home.balanceschart.bch.viewall' defaultMessage='View All Balances' />
              </ViewAllText>
            </NavLink>
          }
        </Column>
      </ChartInfo>
    </Wrapper>
  )
}

export default BalancesChart
