import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import BitcoinDisplay from 'components/shared/BitcoinDisplay'
import CurrencyDisplay from 'components/shared/CurrencyDisplay'

import { Text } from 'components/generic/Text'
import { Typography } from 'components/generic/Typography'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
`
const Header = styled.div`
  width: 100%;
  padding: 10px 0;
`
const Content = styled.div`
  width: 100%;
  border: 1px solid #D2CED0;
  padding: 10px;
  box-sizing: border-box;
`
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #D2CED0;
  padding: 10px 0;
`
const LastRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
`

const BalanceSummary = (props) => {
  return (
    <Wrapper>
      <Header>
        <Text id='scenes.home.balancesummary.title' text='Balance summary' capitalize />
      </Header>
      <Content>
        { props.balances.map(function (balance, index) {
          return (
            <Row key={index}>
              <Typography small light>{balance.title}</Typography>
              { props.bitcoinDisplayed
                ? <BitcoinDisplay amount={balance.amount} small light />
                : <CurrencyDisplay amount={balance.amount} small light />
              }
            </Row>
          )
        })}
        <LastRow>
          <Text id='scenes.home.balancesummary.total' text='Total' small />
          { props.bitcoinDisplayed
            ? <BitcoinDisplay amount={props.total} small />
            : <CurrencyDisplay amount={props.total} small />
          }
        </LastRow>
      </Content>
    </Wrapper>
  )
}

BalanceSummary.propTypes = {
  balances: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      amount: PropTypes.number
    })
  ),
  total: PropTypes.number.isRequired
}

export default BalanceSummary
