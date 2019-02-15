import React from 'react'
import PropTypes from 'prop-types'
import onClickOutside from 'react-onclickoutside'

import Dropdown from './template'

class ComponentDropdown extends React.PureComponent {
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
    const { toggled } = this.state
    const { toggleOnCallback } = this.props
    this.setState({
      toggled: toggleOnCallback ? false : toggled,
      selectedComponent: this.props.forceSelected
        ? this.props.selectedComponent
        : item
    })
    if (this.props.callback) {
      this.props.callback(item)
    }
  }

  render () {
    const { ...rest } = this.props

    return (
      <Dropdown
        {...rest}
        handleClick={this.handleClick}
        handleCallback={this.handleCallback}
        toggled={this.state.toggled}
        selectedComponent={this.props.selectedComponent}
      />
    )
  }
}

ComponentDropdown.defaultProps = {
  color: 'brand-secondary',
  toggleOnCallback: true,
  uppercase: false,
  opened: false,
  down: false
}

ComponentDropdown.propTypes = {
  callback: PropTypes.func.isRequired,
  toggleOnCallback: PropTypes.bool,
  opened: PropTypes.bool,
  uppercase: PropTypes.bool,
  down: PropTypes.bool
}

export default onClickOutside(ComponentDropdown)
