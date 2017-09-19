import React from 'react'
import PropTypes from 'prop-types'

import NavbarNavItem from './template.js'
import { Palette } from 'blockchain-info-components'
import { keysIn } from 'ramda'

class NavbarNavItemContainer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      hovered: props.opened
    }
    this.handleMouseOver = this.handleMouseOver.bind(this)
    this.handleMouseOut = this.handleMouseOut.bind(this)
  }

  handleMouseOver () {
    this.setState({ hovered: true })
  }

  handleMouseOut () {
    this.setState({ hovered: false })
  }

  render () {
    const { opened, ...rest } = this.props

    return <NavbarNavItem {...rest}
      handleMouseOver={this.handleMouseOver}
      handleMouseOut={this.handleMouseOut}
      hovered={this.state.hovered}
    />
  }
}

NavbarNavItemContainer.defaultProps = {
  color: 'white',
  opened: false,
  uppercase: true
}

NavbarNavItemContainer.PropTypes = {
  opened: PropTypes.bool,
  color: PropTypes.oneOf(keysIn(Palette())),
  uppercase: PropTypes.bool
}

export default NavbarNavItemContainer
