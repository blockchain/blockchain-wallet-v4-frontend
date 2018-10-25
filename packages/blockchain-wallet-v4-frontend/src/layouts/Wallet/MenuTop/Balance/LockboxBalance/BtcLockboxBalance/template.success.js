import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { LinkContainer } from 'react-router-bootstrap'
import { CoinBalanceWrapper } from 'components/Balances'

const Success = props => {
  const { balance } = props

  const Wrapper = styled.div``

  return (
    <LinkContainer to='/lockbox'>
      <Wrapper data-e2e='balanceDropdown-lockbox-btc'>
        <CoinBalanceWrapper coin='BTC' balance={balance} />
      </Wrapper>
    </LinkContainer>
  )
}

Success.propTypes = {
  balance: PropTypes.number.isRequired
}

export default Success
