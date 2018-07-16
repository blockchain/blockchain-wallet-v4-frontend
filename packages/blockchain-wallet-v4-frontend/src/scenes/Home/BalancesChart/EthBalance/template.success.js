import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { gt, gte } from 'ramda'

import { Link, Text } from 'blockchain-info-components'
import { CoinBalance, ColourBar, WalletLink } from 'components/BalancesChart'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'

const EthBalance = props => {
  const {
    btcBalance,
    bchBalance,
    ethBalance,
    handleCoinDisplay,
    partner,
    ...rest
  } = props
  const { handleRefresh, modalsActions } = rest

  return (
    <Fragment>
      <ColourBar color='brand-secondary' />
      <Text size='14px' weight={300}>
        <FormattedMessage
          id='scenes.home.balanceschart.eth'
          defaultMessage='Ether'
        />
      </Text>
      <CoinBalance onClick={handleCoinDisplay}>
        {!gte(ethBalance, 0) ? (
          <Fragment>
            <Text size='14px' weight={200}>
              <FormattedMessage
                id='scenes.home.balanceschart.eth.unkown'
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
            coin='ETH'
            cursor='pointer'
            size='14px'
            weight={200}
          >
            {ethBalance}
          </SwitchableDisplay>
        )}
      </CoinBalance>
      {(gt(btcBalance, 0) || gt(bchBalance, 0)) && !gt(ethBalance, 0) ? (
        <WalletLink to='/exchange' size='10px' weight={300}>
          <FormattedMessage
            id='scenes.home.balanceschart.getstarted'
            defaultMessage='Get Started'
          />
        </WalletLink>
      ) : (
        gt(0, ethBalance) && (
          <Link
            size='10px'
            weight={300}
            onClick={() => modalsActions.showModal('RequestEther')}
          >
            <FormattedMessage
              id='scenes.home.balanceschart.requesteth'
              defaultMessage='Request Ether'
            />
          </Link>
        )
      )}
    </Fragment>
  )
}

export default EthBalance
