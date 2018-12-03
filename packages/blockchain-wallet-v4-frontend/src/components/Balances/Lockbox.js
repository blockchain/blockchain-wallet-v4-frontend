import React from 'react'
import styled from 'styled-components'
import { Icon, Link } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { FormattedMessage } from 'react-intl'

const Wrapper = styled.div`
  display: flex;
  opacity: 1;
  padding: 15px;
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
  cursor: pointer;
  * {
    cursor: pointer;
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

export const CurrencyItem = props => {
  return (
    <Wrapper
      onClick={props.onClick}
      isActive={props.isActive}
      isInactive={props.isInactive}
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
      ) : (
        <Link size='12px' weight={300}>
          <FormattedMessage
            id='components.balances.savecoin'
            defaultMessage='Click here to add {coin} to your Lockbox'
            values={{ coin: props.coin.toUpperCase() }}
          />
        </Link>
      )}
    </Wrapper>
  )
}
