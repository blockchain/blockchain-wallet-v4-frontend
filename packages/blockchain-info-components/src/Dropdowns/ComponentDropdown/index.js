import React from 'react'
import onClickOutside from 'react-onclickoutside'

import Dropdown from './template'

class ComponentDropdown extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      toggled: props.opened
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleCallback = this.handleCallback.bind(this)
  }

  handleClick() {
    this.setState((prevState) => ({ toggled: !prevState.toggled }))

    if (this.props.onClick && !this.state.toggled) this.props.onClick()
  }

  handleClickOutside() {
    this.setState({ toggled: false })
  }

  handleCallback(item) {
    const { toggled } = this.state
    const { toggleOnCallback } = this.props
    this.setState({
      toggled: toggleOnCallback ? false : toggled
    })
    if (this.props.callback) {
      this.props.callback(item)
    }
  }

  render() {
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
  color: 'blue600',
  down: false,
  opened: false,
  toggleOnCallback: true,
  uppercase: false
}

export default onClickOutside(ComponentDropdown)
