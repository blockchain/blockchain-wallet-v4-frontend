import React from 'react'
import PropTypes from 'prop-types'

import CopyClipboard from './template.js'

class CopyClipboardContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.timeout = undefined
    this.state = { active: false }
    this.handleClick = this.handleClick.bind(this)
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  handleClick () {
    this.setState({ active: true })
    this.timeout = setTimeout(() => { this.setState({ active: false }) }, 2000)
  }

  render () {
    return <CopyClipboard active={this.state.active} address={this.props.address} handleClick={this.handleClick} />
  }
}

CopyClipboardContainer.propTypes = {
  address: PropTypes.string.isRequired
}

export default CopyClipboardContainer
