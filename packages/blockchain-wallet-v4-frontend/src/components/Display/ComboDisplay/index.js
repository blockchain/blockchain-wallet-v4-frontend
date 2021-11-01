import React from 'react'
import PropTypes from 'prop-types'

import ComboDisplay from './template'

class ComboDisplayContainer extends React.PureComponent {
  render() {
    return <ComboDisplay {...this.props} />
  }
}

ComboDisplay.propTypes = {
  children: PropTypes.string.isRequired,
  coin: PropTypes.string.isRequired
}

export default ComboDisplayContainer
