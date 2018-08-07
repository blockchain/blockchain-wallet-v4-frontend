import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { LinkContainer } from 'react-router-bootstrap'

import { CoinBalanceWrapper } from 'components/Balances'

const Wrapper = styled.div``

const Success = props => {
  const { balance, large } = props

  return (
    <LinkContainer to='/bch/transactions'>
      <Wrapper>
        <CoinBalanceWrapper coin='BCH' balance={balance} large={large} />
      </Wrapper>
    </LinkContainer>
  )
}

Success.propTypes = {
  balance: PropTypes.number.isRequired
}

export default Success
