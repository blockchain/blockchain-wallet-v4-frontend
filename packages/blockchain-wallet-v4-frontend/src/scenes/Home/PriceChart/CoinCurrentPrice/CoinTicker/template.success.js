import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Text } from 'blockchain-info-components'

const Wrapper = styled.div``

const Success = props => {
  const { fiat } = props

  return (
    <Wrapper>
      <Text
        size='36px'
        weight={500}
        color='brand-primary'
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
