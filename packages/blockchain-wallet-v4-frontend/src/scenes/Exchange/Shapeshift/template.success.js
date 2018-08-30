import React from 'react'
import PropTypes from 'prop-types'

import { EXCHANGE_STEPS } from 'data/components/exchange/model'

import StateRegistration from './StateRegistration'
import ExchangeForm from './ExchangeForm'
import Confirm from './Confirm'
import ExchangeResults from './ExchangeResults'

const Shapeshift = props => {
  switch (props.step) {
    case EXCHANGE_STEPS.STATE_REGISTRATION:
      return <StateRegistration />
    case EXCHANGE_STEPS.EXCHANGE_FORM:
      return <ExchangeForm />
    case EXCHANGE_STEPS.CONFIRM:
      return <Confirm />
    case EXCHANGE_STEPS.EXCHANGE_RESULT:
      return <ExchangeResults />
    default:
      return <ExchangeForm />
  }
}

Shapeshift.propTypes = {
  step: PropTypes.number.isRequired
}

export default Shapeshift
