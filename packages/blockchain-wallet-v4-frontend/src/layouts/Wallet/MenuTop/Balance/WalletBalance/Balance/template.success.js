import React from 'react'
import PropTypes from 'prop-types'
import { LinkContainer } from 'react-router-bootstrap'

import { CoinBalanceWrapper } from 'components/Balances'

const Success = props => {
  const { balance, coin, large } = props

  return (
    <LinkContainer to={`/${coin}/transactions`}>
      <div data-e2e={`balanceDropdown-wallet-${coin}`}>
        <CoinBalanceWrapper coin={coin} balance={balance} large={large} />
      </div>
    </LinkContainer>
  )
}

Success.propTypes = {
  balance: PropTypes.number.isRequired
}

export default Success
