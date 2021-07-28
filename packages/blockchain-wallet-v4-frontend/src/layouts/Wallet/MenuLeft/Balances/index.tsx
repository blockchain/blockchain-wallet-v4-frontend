import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { ComponentDropdown, Text } from 'blockchain-info-components'
import { media, useMedia } from 'services/styles'

import CurrencySwitch from './CurrencySwitch'
import TotalBalance from './TotalBalance'
import WalletBalance from './WalletBalance'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 6px 0 4px;
  padding-left: 16px;
  box-sizing: border-box;

  ${media.laptop`
    padding-left: 0px;
    margin: 0px;
  `}

  ${media.tablet`
    margin-left: 16px;
  `}
`
const TitleText = styled(Text)`
  margin-right: 8px;
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => props.theme.grey600};
  line-height: 150%;
`
const BalanceDropdown = styled.div`
  width: 100%;
  min-width: 100%;
  > div > ul {
    position: absolute;
    top: 28px;
    right: 2px;
    padding: 0;
    width: 230px;
    ${media.laptop`
      right: initial;
      top: 38px;
      z-index: 12;
    `}
  }
  > div > div {
    width: initial;
  }
  > div > div > div > div {
    color: ${(props) => props.theme.grey800};
    font-weight: 600;
    font-size: 24px;
    ${media.laptop`
      color: ${(props) => props.theme.alwaysWhite};
      font-size: 16px;
      padding-right: 4px;
      max-width: 40vw;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: left;
    `}
  }
  > div > div > span:last-child {
    position: absolute;
    top: -6px;
    right: 0;
    font-size: 24px;
    color: ${(props) => props.theme.grey400};
    border: 1px solid ${(props) => props.theme.grey100};
    border-radius: 4px;
    padding: 0;
    &:hover {
      border: 1px solid ${(props) => props.theme.blue600};
      color: ${(props) => props.theme.blue600};
    }

    ${media.laptop`
      position: static;
      right: initial;
      border: 0px;
      color: ${(props) => props.theme.alwaysWhite};
      &:hover {
        border: 0px;
        color: ${(props) => props.theme.alwaysWhite};
      }
    `}
  }
`

const BalancesContainer = () => {
  const isLaptop = useMedia('laptop')

  return (
    <Wrapper>
      {!isLaptop && (
        <TitleText data-e2e='totalBalance'>
          <FormattedMessage
            id='scenes.wallet.menutop.balance.totalbalance'
            defaultMessage='Total Balance'
          />
        </TitleText>
      )}
      <BalanceDropdown>
        <ComponentDropdown
          down
          forceSelected
          toggleOnCallback={false}
          selectedComponent={<TotalBalance large />}
          components={[
            <WalletBalance key='wallet-balance' />,
            <CurrencySwitch key='currency-switch' />
          ]}
        />
      </BalanceDropdown>
    </Wrapper>
  )
}

export default BalancesContainer
