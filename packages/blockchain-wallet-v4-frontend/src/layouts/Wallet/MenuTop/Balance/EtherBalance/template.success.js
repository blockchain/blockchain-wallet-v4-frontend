import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'

const Wrapper = styled.div`
  display: inline-flex;
  flex-direction: row;
  padding-right: 25px;
  padding-left: 5px;
  > div:last-child {
    margin-left: 10px;
    > div {
      color: ${props => props.theme['gray-3']}
    }
  }
`

const Success = props => {
  return (
    <Wrapper>
      <CoinDisplay coin='ETH' size='12px' weight={300}>{props.balance}</CoinDisplay>
      <FiatDisplay coin='ETH' size='12px' weight={300}>{props.balance}</FiatDisplay>
    </Wrapper>
  )
}

Success.propTypes = {
  balance: PropTypes.number.isRequired
}

export default Success
