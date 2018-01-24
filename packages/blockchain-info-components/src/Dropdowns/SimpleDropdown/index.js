import React from 'react'
import PropTypes from 'prop-types'

import Dropdown from './template.js'
import { Color, Palette } from '../../'
import { keysIn } from 'ramda'

class SimpleDropdown extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      toggled: props.opened,
      selectedItem: props.items.filter(item => item.value === props.selectedValue)[0] || props.items[0]
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleCallback = this.handleCallback.bind(this)
  }

  handleClick () {
    this.setState({ toggled: !this.state.toggled })
  }

  handleCallback (item) {
    this.setState({ toggled: false, selectedItem: item })
    if (this.props.callback) { this.props.callback(item) }
  }

  render () {
    const { opened, ...rest } = this.props

    return <Dropdown {...rest}
      handleClick={this.handleClick}
      handleCallback={this.handleCallback}
      toggled={this.state.toggled}
      selectedItem={this.state.selectedItem}
    />
  }
}

SimpleDropdown.defaultProps = {
  color: 'brand-secondary',
  opened: false,
  selectedValue: 0,
  uppercase: true,
  down: false
}

SimpleDropdown.PropTypes = {
  selectedValue: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.object.isRequired]),
    value: PropTypes.string.isRequired
  })),
  callback: PropTypes.func.isRequired,
  opened: PropTypes.bool,
  color: PropTypes.oneOf(keysIn(Palette())),
  uppercase: PropTypes.bool,
  down: PropTypes.bool
}

export default SimpleDropdown
