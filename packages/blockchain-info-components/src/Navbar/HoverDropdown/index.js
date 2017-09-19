import React from 'react'
import PropTypes from 'prop-types'

import Dropdown from './template.js'
import { Palette } from 'blockchain-info-components'
import { keysIn } from 'ramda'

class HoverDropdown extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      toggled: props.opened
    }
    this.handleMouseOver = this.handleMouseOver.bind(this)
    this.handleMouseOut = this.handleMouseOut.bind(this)
  }

  handleMouseOver () {
    this.setState({ toggled: true })
  }

  handleMouseOut () {
    this.setState({ toggled: true })
  }

  render () {
    const { opened, ...rest } = this.props

    return <Dropdown {...rest}
      handleMouseOver={this.handleMouseOver}
      handleMouseOut={this.handleMouseOut}
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
