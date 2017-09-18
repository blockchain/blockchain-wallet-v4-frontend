import React from 'react'
import PropTypes from 'prop-types'

import Dropdown from './template.js'
import { Palette } from '../../'
import { keysIn } from 'ramda'

class HoverDropdown extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      toggled: props.opened
    }
    this.handleMouseOver = this.handleMouseOver.bind(this)
  }

  handleMouseOver () {
    this.setState({ toggled: !this.state.toggled })
  }

  render () {
    const { opened, ...rest } = this.props

    return <Dropdown {...rest}
      handleMouseOver={this.handleMouseOver}
      toggled={this.state.toggled}
    />
  }
}

HoverDropdown.defaultProps = {
  color: 'white',
  opened: false,
  uppercase: true
}

HoverDropdown.PropTypes = {
  opened: PropTypes.bool,
  color: PropTypes.oneOf(keysIn(Palette())),
  uppercase: PropTypes.bool
}

export default HoverDropdown
