import React from 'react'
import PropTypes from 'prop-types'

import Template from './template'

class Banner extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { visible: true }
    this.handleDismiss = this.handleDismiss.bind(this)
  }

  componentWillMount () {}

  componentWillUnmount () {}

  handleDismiss () {
    this.setState({ visible: false })
  }

  render () {
    return this.state.visible && <Template {...this.props} handleDismiss={this.handleDismiss}/>
  }
}

Banner.propTypes = {
  children: PropTypes.node.isRequired,
  dismissible: PropTypes.bool,
  type: PropTypes.oneOf(['success', 'warning', 'alert', 'caution', 'informational']),
  width: PropTypes.string,
}

export default Banner
