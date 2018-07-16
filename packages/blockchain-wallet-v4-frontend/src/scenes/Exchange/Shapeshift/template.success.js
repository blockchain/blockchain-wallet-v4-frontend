import React from 'react'
import PropTypes from 'prop-types'

import StateRegistrationStep from './StateRegistrationStep'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import ThirdStep from './ThirdStep'

const Shapeshift = (props) => {
  switch (props.step) {
    case 0: return <StateRegistrationStep/>
    case 1: return <FirstStep/>
    case 2: return <SecondStep/>
    case 3: return <ThirdStep/>
    default: return <FirstStep/>
  }
}

Shapeshift.propTypes = {
  step: PropTypes.number.isRequired
}

export default Shapeshift
