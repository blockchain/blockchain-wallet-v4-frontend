import React from 'react'
import onClickOutside from 'react-onclickoutside'
import PropTypes from 'prop-types'

import Dropdown from './template'

class SimpleDropdown extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      selectedItem:
        props.items.filter((item) => item.value === props.selectedValue)[0] || props.items[0],
      toggled: props.opened
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleCallback = this.handleCallback.bind(this)
  }

  handleClick() {
    this.setState({ toggled: !this.state.toggled })
  }

  handleClickOutside() {
    this.setState({ toggled: false })
  }

  handleCallback(item) {
    this.setState({ selectedItem: item, toggled: false })
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
        selectedItem={this.state.selectedItem}
      />
    )
  }
}

SimpleDropdown.defaultProps = {
  color: 'blue600',
  down: false,
  opened: false,
  selectedValue: 0,
  size: '14px',
  uppercase: true
}

SimpleDropdown.propTypes = {
  callback: PropTypes.func.isRequired,
  down: PropTypes.bool,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ),
  opened: PropTypes.bool,
  selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  size: PropTypes.string,
  uppercase: PropTypes.bool
}

export default onClickOutside(SimpleDropdown)
