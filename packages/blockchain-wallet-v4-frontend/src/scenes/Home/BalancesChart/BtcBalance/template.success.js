import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'
import { gt, gte } from 'ramda'

import { Link, Text } from 'blockchain-info-components'
import {
  CoinBalance,
  ColourBar,
  ViewAllText,
  WalletLink
} from 'components/BalancesChart'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'

const BtcBalance = props => {
  const {
    btcBalance,
    bchBalance,
    ethBalance,
    btcAccountsLength,
    handleCoinDisplay,
    partner,
    ...rest
  } = props
  const { handleRefresh, modalsActions } = rest
  return (
    <Fragment>
      <ColourBar color='brand-primary' />
      <Text size='14px' weight={300}>
        <FormattedMessage
          id='scenes.home.balanceschart.btc'
          defaultMessage='Bitcoin'
        />
      </Text>
      <CoinBalance onClick={handleCoinDisplay}>
        {!gte(btcBalance, 0) ? (
          <Fragment>
            <Text size='14px' weight={200}>
              <FormattedMessage
                id='scenes.home.balanceschart.btc.unkown'
                defaultMessage='Unknown amount'
              />
            </Text>
            <Link size='12px' weight={200} onClick={handleRefresh}>
              <FormattedMessage
                id='scenes.home.balanceschart.btc.refresh'
                defaultMessage='Refresh'
              />
            </Link>
          </Fragment>
        ) : (
          <SwitchableDisplay
            coin='BTC'
            cursor='pointer'
            size='14px'
            weight={200}
          >
            {btcBalance}
          </SwitchableDisplay>
        )}
      </CoinBalance>
      {partner ? (
        gt(0, btcBalance) && (
          <WalletLink to='/buy-sell' size='10px' weight={300}>
            <FormattedMessage
              id='scenes.home.balanceschart.buybtc'
              defaultMessage='Buy Bitcoin'
            />
          </WalletLink>
        )
      ) : gt(ethBalance, 0) || gt(bchBalance, 0) ? (
        <WalletLink to='/exchange' size='10px' weight={300}>
          <FormattedMessage
            id='scenes.home.balanceschart.getstarted'
            defaultMessage='Get Started'
          />
        </WalletLink>
      ) : (
        gt(0, btcBalance) && (
          <Link
            size='10px'
            weight={300}
            onClick={() => modalsActions.showModal('RequestBitcoin')}
          >
            <FormattedMessage
              id='scenes.home.balanceschart.requestbtc'
              defaultMessage='Request Bitcoin'
            />
          </Link>
        )
      )}
      {btcAccountsLength > 1 && gt(btcBalance, 0) ? (
        <NavLink to='/settings/addresses' style={{ textDecoration: 'none' }}>
          <ViewAllText weight={300} size='10px'>
            <FormattedMessage
              id='scenes.home.balanceschart.btc.viewall'
              defaultMessage='View All Balances'
            />
          </ViewAllText>
        </NavLink>
      ) : null}
    </Fragment>
  )
}

export default BtcBalance
