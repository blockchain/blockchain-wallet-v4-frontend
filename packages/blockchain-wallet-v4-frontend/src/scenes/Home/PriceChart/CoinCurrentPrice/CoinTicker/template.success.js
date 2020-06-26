import { Text } from 'blockchain-info-components'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div``

const Success = props => {
  const { fiat } = props

  return (
    <Wrapper>
      <Text
        size='36px'
        weight={400}
        color='blue900'
        data-e2e={props['data-e2e']}
      >
        {fiat}
      </Text>
    </Wrapper>
  )
}

Success.propTypes = {
  fiat: PropTypes.string.isRequired
}

export default Success
