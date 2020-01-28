import { LinkContainer } from 'react-router-bootstrap'
import PropTypes from 'prop-types'
import React from 'react'

import { CoinBalanceWrapper } from '../../model'

const Success = props => (
  <LinkContainer to='/lockbox'>
    <div data-e2e='balanceDropdown-lockbox-xlm'>
      <CoinBalanceWrapper coin='XLM' balance={props.balance} />
    </div>
  </LinkContainer>
)

Success.propTypes = {
  balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
}

export default Success
