import React from 'react'
import PropTypes from 'prop-types'

import Dropdown from './template.js'
import { Color, Palette } from '../../'
import { keysIn } from 'ramda'

class ComponentDropdown extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      toggled: props.opened,
      forceSelected: props.forceSelected,
      selectedComponent: props.selectedComponent
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleCallback = this.handleCallback.bind(this)
  }

  handleClick () {
    this.setState({ toggled: !this.state.toggled })
  }

  handleCallback (item) {
    this.setState({ toggled: false, selectedComponent: this.state.forceSelected ? this.state.selectedComponent : item })
    if (this.props.callback) { this.props.callback(item) }
  }

  render () {
    const { opened, ...rest } = this.props

    return <Dropdown {...rest}
      handleClick={this.handleClick}
      handleCallback={this.handleCallback}
      toggled={this.state.toggled}
      selectedComponent={this.state.selectedComponent}
    />
  }
}

ComponentDropdown.defaultProps = {
  color: 'brand-secondary',
  opened: false,
  uppercase: true,
  down: false
}

ComponentDropdown.PropTypes = {
  callback: PropTypes.func.isRequired,
  opened: PropTypes.bool,
  color: PropTypes.oneOf(keysIn(Palette())),
  uppercase: PropTypes.bool,
  down: PropTypes.bool
}

export default ComponentDropdown
