import React from 'react'
import styled from 'styled-components'
import { CurrencyItem } from 'components/Balances'
import { any, equals, toLower, prop, isEmpty } from 'ramda'

const CurrencyList = styled.div`
  display: flex;
  width: 100%;
  padding: 20px 30px;
  border-bottom: 1px solid ${props => props.theme['gray-1']};
`

const Success = props => {
  const { data, formValues, ...rest } = props
  const { handleCoinSelection } = rest

  const isActive = coin =>
    any(val => equals(toLower(prop('label', val)), toLower(coin)), formValues)

  return (
    <CurrencyList>
      <CurrencyItem
        coin='btc'
        icon='bitcoin-filled'
        balance={data.btcBalance}
        isActive={isActive('btc')}
        isInactive={!isEmpty(formValues) && !isActive('btc')}
        onClick={() => handleCoinSelection('BTC')}
      />
      <CurrencyItem
        coin='bch'
        icon='bitcoin-filled'
        balance={data.bchBalance}
        isActive={isActive('bch')}
        isInactive={!isEmpty(formValues) && !isActive('bch')}
        onClick={() => handleCoinSelection('BCH')}
      />
      <CurrencyItem
        coin='eth'
        icon='ethereum-filled'
        balance={data.ethBalance}
        isActive={isActive('eth')}
        isInactive={!isEmpty(formValues) && !isActive('eth')}
        onClick={() => handleCoinSelection('ETH')}
      />
    </CurrencyList>
  )
}

export default Success
