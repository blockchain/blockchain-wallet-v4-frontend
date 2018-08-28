import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { EXCHANGE_STEPS } from 'data/components/exchange/model'

import ExchangeForm from '../ExchangeForm'
import ExchangeResults from '../ExchangeResults'
import { getData } from './selectors'

const ExchangeContainer = ({ step }) => {
  switch (step) {
    case EXCHANGE_STEPS.EXCHANGE_FORM:
      return <ExchangeForm />
    case EXCHANGE_STEPS.EXCHANGE_RESULT:
      return <ExchangeResults />
    default:
      return <ExchangeForm />
  }
}

ExchangeContainer.propTypes = {
  step: PropTypes.number.isRequired
}

export default connect(getData)(ExchangeContainer)
