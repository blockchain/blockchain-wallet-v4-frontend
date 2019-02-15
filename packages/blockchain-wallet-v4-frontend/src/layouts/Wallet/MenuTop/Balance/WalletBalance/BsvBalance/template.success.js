import React from 'react'
import PropTypes from 'prop-types'
import { LinkContainer } from 'react-router-bootstrap'

import { CoinBalanceWrapper } from 'components/Balances'

const Success = props => {
  const { balance, large } = props

  return (
    <LinkContainer to='/settings/addresses/bsv'>
      <div data-e2e='balanceDropdown-wallet-bsv'>
        <CoinBalanceWrapper coin='BSV' balance={balance} large={large} />
      </div>
    </LinkContainer>
  )
}

Success.propTypes = {
  balance: PropTypes.number.isRequired
}

export default Success
