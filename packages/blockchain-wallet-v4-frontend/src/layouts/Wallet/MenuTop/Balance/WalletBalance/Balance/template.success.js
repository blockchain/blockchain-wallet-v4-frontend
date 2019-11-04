import PropTypes from 'prop-types'
import React from 'react'

import { CoinBalanceWrapper } from 'components/Balances'

const Success = props => {
  const { balance, coin, coinTicker, large } = props

  return (
    <div data-e2e={`balanceDropdown-wallet-${coin}`}>
      <CoinBalanceWrapper
        coin={coin}
        balance={balance}
        large={large}
        coinTicker={coinTicker}
      />
    </div>
  )
}

Success.propTypes = {
  balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
}

export default Success
