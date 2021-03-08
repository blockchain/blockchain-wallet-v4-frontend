import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import PropTypes from 'prop-types'

import { CoinBalanceWrapper } from '../../model'

const Success = props => (
  <LinkContainer to='/lockbox'>
    <div data-e2e='balanceDropdown-lockbox-btc'>
      <CoinBalanceWrapper coin='BTC' balance={props.balance} />
    </div>
  </LinkContainer>
)

Success.propTypes = {
  balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
}

export default Success
