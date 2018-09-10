import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { LinkContainer } from 'react-router-bootstrap'
import { HomeCoinBalanceCell } from 'components/Balances'

const Success = props => {
  const { balance } = props

  const Wrapper = styled.div``

  return (
    <LinkContainer to='/bch/transactions'>
      <Wrapper>
        <HomeCoinBalanceCell
          coin='BCH'
          coinName='Bitcoin Cash'
          coinIcon='bch'
          balance={balance}
        />
      </Wrapper>
    </LinkContainer>
  )
}

Success.propTypes = {
  balance: PropTypes.number.isRequired
}

export default Success
