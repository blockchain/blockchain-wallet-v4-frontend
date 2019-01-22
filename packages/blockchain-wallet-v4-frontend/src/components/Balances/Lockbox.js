import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import * as bowser from 'bowser'

import { Icon, Link, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'

const Wrapper = styled.div`
  display: flex;
  padding: 10px;
  max-width: 200px;
  margin-right: 25px;
  flex-direction: row;
  align-items: center;
  border-radius: 3px;
  transition: box-shadow 0.3s, opacity 0.3s;
  opacity: ${props => (props.isInactive ? 0.5 : 1)};
  background-color: ${props => props.theme['white-blue']};
  box-shadow: ${props =>
    props.isActive ? '0px 5px 30px 0px rgba(0,0,0,0.1)' : 'none'};
  cursor: ${props => (props.disableClick ? 'not-allowed' : 'pointer')};
  * {
    cursor: ${props => (props.disableClick ? 'not-allowed' : 'pointer')};
  }
  @media (max-width: 770px) {
    margin-right: 15px;
  }
  &:last-child {
    margin-right: 0;
  }
`
const IconBox = styled.div`
  padding: 5px;
  margin-right: 10px;
  border-radius: 3px;
  background-color: ${props => props.theme[props.coin]};
`
const Balance = styled.div`
  > div:first-child {
    margin-bottom: 3px;
  }
`
const isBrowserChrome = bowser.name === 'Chrome' || bowser.name === 'Chromium'

export const CurrencyItem = props => {
  return (
    <Wrapper
      onClick={props.onClick}
      isActive={props.isActive}
      isInactive={props.isInactive}
      disableClick={props.disableClick}
    >
      <IconBox coin={props.coin}>
        <Icon size='32px' color='white' name={props.icon} />
      </IconBox>
      {props.isSaved ? (
        <Balance>
          <FiatDisplay size='14px' weight={400} coin={props.coin.toUpperCase()}>
            {props.balance}
          </FiatDisplay>
          <CoinDisplay size='13px' weight={200} coin={props.coin.toUpperCase()}>
            {props.balance}
          </CoinDisplay>
        </Balance>
      ) : isBrowserChrome ? (
        <Link size='12px' weight={300}>
          <FormattedMessage
            id='components.balances.savecointolockbox'
            defaultMessage='Click here to add {coin} to your Lockbox'
            values={{ coin: props.coin.toUpperCase() }}
          />
        </Link>
      ) : (
        <Text size='12px' weight={300}>
          <FormattedMessage
            id='components.balances.savecointolockboxbrowser'
            defaultMessage='Use the Chrome browser to add {coin} to your Lockbox'
            values={{ coin: props.coin.toUpperCase() }}
          />
        </Text>
      )}
    </Wrapper>
  )
}
