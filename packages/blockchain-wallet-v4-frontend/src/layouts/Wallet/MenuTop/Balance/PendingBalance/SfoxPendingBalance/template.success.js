import { CoinBalanceWrapper } from 'components/Balances'
import { LinkContainer } from 'react-router-bootstrap'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

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
  balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
}

export default Success
