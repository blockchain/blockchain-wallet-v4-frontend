import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { LinkContainer } from 'react-router-bootstrap'
import { CoinBalanceWrapper } from 'components/Balances'

const Wrapper = styled.div``

const Success = props => {
  return props.balance === 0 ? null : (
    <LinkContainer to='/buy-sell'>
      <Wrapper>
        <CoinBalanceWrapper coin='BTC' balance={props.balance} />
      </Wrapper>
    </LinkContainer>
  )
}

Success.propTypes = {
  balance: PropTypes.number.isRequired
}

export default Success
