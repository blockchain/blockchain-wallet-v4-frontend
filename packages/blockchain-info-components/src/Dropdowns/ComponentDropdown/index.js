import React from 'react'
import PropTypes from 'prop-types'
import onClickOutside from 'react-onclickoutside'

import Dropdown from './template.js'
import { Palette } from '../../'
import { keysIn } from 'ramda'

class ComponentDropdown extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      toggled: props.opened
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleCallback = this.handleCallback.bind(this)
  }

  handleClick () {
    this.setState({ toggled: !this.state.toggled })
  }
  
  handleClickOutside () {
    this.setState({ toggled: false })
  }

  handleCallback (item) {
    this.setState({ toggled: false, selectedComponent: this.props.forceSelected ? this.props.selectedComponent : item })
    if (this.props.callback) { this.props.callback(item) }
  }

  render () {
    const { ...rest } = this.props

    return <Dropdown {...rest}
      handleClick={this.handleClick}
      handleCallback={this.handleCallback}
      toggled={this.state.toggled}
      selectedComponent={this.props.selectedComponent}
    />
  }
}

ComponentDropdown.defaultProps = {
  color: 'brand-secondary',
  opened: false,
  uppercase: true,
  down: false
}

ComponentDropdown.propTypes = {
  callback: PropTypes.func.isRequired,
  opened: PropTypes.bool,
  color: PropTypes.oneOf(keysIn(Palette())),
  uppercase: PropTypes.bool,
  down: PropTypes.bool
}

export default onClickOutside(ComponentDropdown)
