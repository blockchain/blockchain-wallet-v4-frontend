import React from 'react'
import PropTypes from 'prop-types'

import modalEnhancer from 'providers/ModalEnhancer'
import ExchangeDetails from './template.js'

class ExchangeDetailsContainer extends React.Component {
  render () {
    return <ExchangeDetails {...this.props} />
  }
}

ExchangeDetailsContainer.propTypes = {
  trade: PropTypes.object.isRequired
}

export default modalEnhancer('ExchangeDetails')(ExchangeDetailsContainer)
