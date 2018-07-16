import React from 'react'
import PropTypes from 'prop-types'

import ComboDisplay from './template.js'

class ComboDisplayContainer extends React.PureComponent {
  render () {
    return <ComboDisplay {...this.props} />
  }
}

ComboDisplay.propTypes = {
  coin: PropTypes.oneOf(['BTC', 'ETH', 'BCH']).isRequired,
  children: PropTypes.string.isRequired
}

export default ComboDisplayContainer
