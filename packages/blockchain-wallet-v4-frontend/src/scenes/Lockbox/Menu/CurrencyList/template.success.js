import React from 'react'
import styled from 'styled-components'
import * as bowser from 'bowser'
import { any, equals, toLower, prop, isEmpty } from 'ramda'

import { CurrencyItem } from 'components/Balances'

const CurrencyList = styled.div`
  display: flex;
  width: 100%;
  padding: 10px 30px;
  overflow-x: scroll;
  border-bottom: 1px solid ${props => props.theme['gray-1']};
`
const Coin = styled(CurrencyItem)`
  padding: 10px;
  margin-right: 10px;
`
const isBrowserChrome = bowser.name === 'Chrome' || bowser.name === 'Chromium'
const Success = props => {
  const { data, formValues, ...rest } = props
  const { coinContexts, handleCoinSelection, handleSaveCoinMD } = rest

  const isActive = coin =>
    any(val => equals(toLower(prop('label', val)), toLower(coin)), formValues)

  return (
    <CurrencyList>
      <Coin
        coin='btc'
        icon='btc'
        balance={data.btcBalance}
        isActive={isActive('btc')}
        isSaved={prop('btc', coinContexts) > 0}
        isInactive={!isEmpty(formValues) && !isActive('btc')}
        onClick={() => handleCoinSelection('BTC')}
      />
      <Coin
        coin='eth'
        icon='eth'
        balance={data.ethBalance}
        isActive={isActive('eth')}
        isSaved={prop('eth', coinContexts) > 0}
        isInactive={!isEmpty(formValues) && !isActive('eth')}
        onClick={() => handleCoinSelection('ETH')}
      />
      <Coin
        coin='bch'
        icon='bch'
        balance={data.bchBalance}
        isActive={isActive('bch')}
        isSaved={prop('bch', coinContexts) > 0}
        isInactive={!isEmpty(formValues) && !isActive('bch')}
        onClick={() => handleCoinSelection('BCH')}
      />
      <Coin
        coin='xlm'
        icon='xlm'
        balance={data.xlmBalance}
        isActive={isActive('xlm')}
        isSaved={prop('xlm', coinContexts) > 0}
        disableClick={!(prop('xlm', coinContexts) > 0) && !isBrowserChrome}
        isInactive={!isEmpty(formValues) && !isActive('xlm')}
        onClick={() =>
          prop('xlm', coinContexts) > 0
            ? handleCoinSelection('XLM')
            : isBrowserChrome && handleSaveCoinMD('xlm')
        }
      />
    </CurrencyList>
  )
}

export default Success
