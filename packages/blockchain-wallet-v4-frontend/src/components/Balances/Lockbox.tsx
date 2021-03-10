import React from 'react'
import { FormattedMessage } from 'react-intl'
import Bowser from 'bowser'
import styled from 'styled-components'

import { Icon, Link, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { model } from 'data'
import { media } from 'services/styles'

const Wrapper = styled.div<{
  disableClick?: boolean
  isActive?: boolean
  isInactive?: boolean
}>`
  display: flex;
  padding: 10px;
  width: 165px;
  margin-right: 25px;
  flex-direction: row;
  align-items: center;
  border-radius: 3px;
  transition: box-shadow 0.3s, opacity 0.3s;
  opacity: ${props => (props.isInactive ? 0.5 : 1)};
  background-color: ${props => props.theme.grey000};
  box-shadow: ${props =>
    props.isActive ? 'rgba(0,0,0,.25) 0px 5px 12px 0px' : 'none'};
  cursor: ${props => (props.disableClick ? 'not-allowed' : 'pointer')};
  * {
    cursor: ${props => (props.disableClick ? 'not-allowed' : 'pointer')};
  }
  ${media.tablet`
    margin-right: 15px;
  `}
  &:last-child {
    margin-right: 0;
  }
`
const IconBox = styled.div<{ coin: string }>`
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
const browser = Bowser.getParser(window.navigator.userAgent)
const isBrowserSupported = browser.satisfies(
  model.components.lockbox.supportedBrowsers
)

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
          <FiatDisplay size='14px' weight={500} coin={props.coin.toUpperCase()}>
            {props.balance}
          </FiatDisplay>
          <CoinDisplay size='13px' weight={400} coin={props.coin.toUpperCase()}>
            {props.balance}
          </CoinDisplay>
        </Balance>
      ) : isBrowserSupported ? (
        <Link size='11px' weight={500}>
          <FormattedMessage
            id='components.balances.savecointolockbox'
            defaultMessage='Click here to add {coin} to your Lockbox'
            values={{ coin: props.coin.toUpperCase() }}
          />
        </Link>
      ) : (
        <Text size='12px' weight={400}>
          <FormattedMessage
            id='components.balances.browserblock'
            defaultMessage='Use the Brave, Chrome, Firefox or Opera browsers to add {coin} to your Lockbox'
            values={{ coin: props.coin.toUpperCase() }}
          />
        </Text>
      )}
    </Wrapper>
  )
}
