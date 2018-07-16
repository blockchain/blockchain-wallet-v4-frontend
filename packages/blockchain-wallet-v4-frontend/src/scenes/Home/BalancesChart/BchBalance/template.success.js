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

const BchBalance = props => {
  const {
    btcBalance,
    bchBalance,
    ethBalance,
    bchAccountsLength,
    handleCoinDisplay,
    partner,
    ...rest
  } = props
  const { handleRefresh, modalsActions } = rest

  return (
    <Fragment>
      <ColourBar color='brand-tertiary' />
      <Text size='14px' weight={300}>
        <FormattedMessage
          id='scenes.home.balanceschart.bch'
          defaultMessage='Bitcoin Cash'
        />
      </Text>
      <CoinBalance onClick={handleCoinDisplay}>
        {!gte(bchBalance, 0) ? (
          <Fragment>
            <Text size='14px' weight={200}>
              <FormattedMessage
                id='scenes.home.balanceschart.bch.unkown'
                defaultMessage='Unknown amount'
              />
            </Text>
            <Link size='12px' weight={200} onClick={handleRefresh}>
              <FormattedMessage
                id='scenes.home.balanceschart.bch.refresh'
                defaultMessage='Refresh'
              />
            </Link>
          </Fragment>
        ) : (
          <SwitchableDisplay
            coin='BCH'
            cursor='pointer'
            size='14px'
            weight={200}
          >
            {bchBalance}
          </SwitchableDisplay>
        )}
      </CoinBalance>
      {(gt(btcBalance, 0) || gt(ethBalance, 0)) && !gt(bchBalance, 0) ? (
        <WalletLink to='/exchange' size='10px' weight={300}>
          <FormattedMessage
            id='scenes.home.balanceschart.getstarted'
            defaultMessage='Get Started'
          />
        </WalletLink>
      ) : (
        gt(0, bchBalance) && (
          <Link
            size='10px'
            weight={300}
            onClick={() => modalsActions.showModal('RequestBch')}
          >
            <FormattedMessage
              id='scenes.home.balanceschart.requestbch'
              defaultMessage='Request Bitcoin Cash'
            />
          </Link>
        )
      )}
      {bchAccountsLength > 1 && gt(bchBalance, 0) ? (
        <NavLink
          to='/settings/addresses/bch'
          style={{ textDecoration: 'none' }}
        >
          <ViewAllText weight={300} size='10px'>
            <FormattedMessage
              id='scenes.home.balanceschart.bch.viewall'
              defaultMessage='View All Balances'
            />
          </ViewAllText>
        </NavLink>
      ) : null}
    </Fragment>
  )
}

export default BchBalance
