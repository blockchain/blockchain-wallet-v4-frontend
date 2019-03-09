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
        weight={400}
        color='brand-primary'
        data-e2e={props['data-e2e']}
      >
        {fiat}
      </Text>
    </Wrapper>
  )
}

Success.propTypes = {
  coin: PropTypes.string.isRequired,
  fiat: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  selected: PropTypes.bool
}

Success.defaultProps = {
  selected: false
}

export default Success
