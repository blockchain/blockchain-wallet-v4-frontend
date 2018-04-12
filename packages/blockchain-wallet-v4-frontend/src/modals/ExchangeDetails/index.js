import React from 'react'
import PropTypes from 'prop-types'

import { formatTrade } from 'services/ShapeshiftService'
import modalEnhancer from 'providers/ModalEnhancer'
import ExchangeDetails from './template'

class ExchangeDetailsContainer extends React.Component {
  render () {
    const { trade, ...rest } = this.props
    return <ExchangeDetails trade={formatTrade(this.props.trade)} {...rest} />
  }
}

ExchangeDetails.propTypes = {
  trade: PropTypes.object.isRequired
}

export default modalEnhancer('ExchangeDetails')(ExchangeDetailsContainer)
