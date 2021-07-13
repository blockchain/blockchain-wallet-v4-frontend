import React from 'react'
import Bowser from 'bowser'
import { any, equals, isEmpty, prop, toLower } from 'ramda'
import styled from 'styled-components'

import { CurrencyItem } from 'components/Balances'
import { model } from 'data'
import { media } from 'services/styles'

const CurrencyList = styled.div`
  display: flex;
  width: calc(100% - 340px);
  padding: 16px 30px;
  overflow-x: scroll;
  border-bottom: 1px solid ${props => props.theme.grey000};
  ${media.tablet`
    padding: 4px;
  `}
`
const TourWrapper = styled.div`
  display: flex;
  flex-direction: row;
`
const Coin = styled(CurrencyItem)`
  padding: 10px;
  margin-right: 10px;
  ${media.tablet`
    margin-right: 4px;
  `}
`
const browser = Bowser.getParser(window.navigator.userAgent)
const isBrowserSupported = browser.satisfies(
  model.components.lockbox.supportedBrowsers
)
const Success = props => {
  const { data, formValues, ...rest } = props
  const { coinContexts, handleCoinSelection, handleSaveCoinMD } = rest

  const isActive = coin =>
    any(val => equals(toLower(prop('label', val)), toLower(coin)), formValues)

  return (
    <CurrencyList>
      <TourWrapper className='tour-step2'>
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
          disableClick={!(prop('xlm', coinContexts) > 0) && !isBrowserSupported}
          isInactive={!isEmpty(formValues) && !isActive('xlm')}
          onClick={() =>
            prop('xlm', coinContexts) > 0
              ? handleCoinSelection('XLM')
              : isBrowserSupported && handleSaveCoinMD('xlm')
          }
          style={{ marginRight: '0' }}
        />
      </TourWrapper>
    </CurrencyList>
  )
}

export default Success
