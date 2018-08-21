import React from 'react'
import styled from 'styled-components'
import { Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  min-width: 160px;
  padding: 10px;
  > div:not(:last-child) {
    margin-bottom: 5px;
  }
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px !important;
`

export const CoinBalanceWrapper = props => {
  const CoinBalanceMain = styled.div`
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    font-size: 20px;
    font-weight: 200;
    padding-right: 15px;
    > div:last-child {
      margin-left: 10px;
      > div {
        color: ${props => props.theme['gray-3']};
      }
    }
  `
  const CoinBalanceSwitchable = styled.div`
    display: flex;
    justify-content: space-between;
  `
  return props.large ? (
    <CoinBalanceMain>
      <CoinDisplay
        coin={props.coin}
        cursor='pointer'
        mobileSize='14px'
        size='20px'
        weight={200}
      >
        {props.balance}
      </CoinDisplay>
      <FiatDisplay
        coin={props.coin}
        cursor='pointer'
        mobileSize='14px'
        size='20px'
        weight={200}
      >
        {props.balance}
      </FiatDisplay>
    </CoinBalanceMain>
  ) : (
    <CoinBalanceSwitchable>
      <Text size='12px' weight={300}>
        {props.coin}
      </Text>
      <SwitchableDisplay size='12px' weight={400} coin={props.coin}>
        {props.balance}
      </SwitchableDisplay>
    </CoinBalanceSwitchable>
  )
}

export const HomeBalanceTable = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

export const HomeBalanceRow = styled.div`
  flex: 1;
  padding: 10px 20px;
  @media (min-width: 768px) {
    padding: 15px 30px;
  }
  border-bottom: 1px solid ${props => props.theme['gray-1']};
`

export const HomeBalanceHeaderTitle = styled(Text)`
  font-size: 20px;
  font-weight: 200;
  text-transform: uppercase;
  color: ${props => props.theme['brand-primary']};
`

export const HomeBalanceAmount = styled(Text)`
  font-size: 28px;
  font-weight: 200;
  margin-top: 10px;
  color: ${props => props.theme['brand-primary']};
`
