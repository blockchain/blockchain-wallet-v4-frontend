import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import StateRegistrationStep from './StateRegistrationStep'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import ThirdStep from './ThirdStep'
import Tooltips from './Tooltips'

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
          <Tooltips />
        </Wrapper>
      )
    case 1:
      return (
        <Wrapper>
          <FirstStep />
          <Tooltips />
        </Wrapper>
      )
    case 2:
      return (
        <Wrapper>
          <SecondStep />
          <Tooltips />
        </Wrapper>
      )
    case 3:
      return (
        <Wrapper>
          <ThirdStep />
          <Tooltips />
        </Wrapper>
      )
    default:
      return (
        <Wrapper>
          <FirstStep />
          <Tooltips />
        </Wrapper>
      )
  }
}

Shapeshift.propTypes = {
  step: PropTypes.number.isRequired
}

export default Shapeshift
