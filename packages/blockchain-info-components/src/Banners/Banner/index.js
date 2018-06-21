import React from 'react'
import PropTypes from 'prop-types'

import Template from './template'

class Banner extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { collapsed: false, visible: true }
    this.handleDismiss = this.handleDismiss.bind(this)
    this.toggleCollapse = this.toggleCollapse.bind(this)
  }

  componentWillMount () {}

  componentWillUnmount () {}

  handleDismiss () {
    this.setState({ visible: false })
  }

  toggleCollapse () {
    this.setState({ collapsed: !this.state.collapsed })
  }

  render () {
    return this.state.visible && <Template {...this.props} collapsed={this.state.collapsed} handleDismiss={this.handleDismiss} toggleCollapse={this.toggleCollapse}/>
  }
}

Banner.propTypes = {
  children: PropTypes.node.isRequired,
  collapsible: PropTypes.bool,
  dismissible: PropTypes.bool,
  type: PropTypes.oneOf(['success', 'warning', 'alert', 'caution', 'info']),
  width: PropTypes.string,
}

export default Banner
