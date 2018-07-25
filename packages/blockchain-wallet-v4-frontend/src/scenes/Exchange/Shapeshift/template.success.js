import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import StateRegistrationStep from './StateRegistrationStep'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import ThirdStep from './ThirdStep'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;
`

const Shapeshift = props => {
  switch (props.step) {
    case 0:
      return (
        <Wrapper>
          <StateRegistrationStep />
        </Wrapper>
      )
    case 1:
      return (
        <Wrapper>
          <FirstStep />
        </Wrapper>
      )
    case 2:
      return (
        <Wrapper>
          <SecondStep />
        </Wrapper>
      )
    case 3:
      return (
        <Wrapper>
          <ThirdStep />
        </Wrapper>
      )
    default:
      return (
        <Wrapper>
          <FirstStep />
        </Wrapper>
      )
  }
}

Shapeshift.propTypes = {
  step: PropTypes.number.isRequired
}

export default Shapeshift
