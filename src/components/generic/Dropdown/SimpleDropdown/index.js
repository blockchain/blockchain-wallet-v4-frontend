import React from 'react'
import PropTypes from 'prop-types'
import { DropdownButton, MenuItem } from 'react-bootstrap'

const SimpleDropdown = (props) => (
  <DropdownButton id={props.id} bsStyle='primary' title={props.display} open={props.dropdownOpen} handleToggle={props.toggle} dropup>
    { props.items.map(function (item, index) {
      return (<MenuItem key={index} onClick={() => props.callback(item.value)}>{item.text}</MenuItem>)
    })}
  </DropdownButton>
)

SimpleDropdown.PropTypes = {
  id: PropTypes.string.isRequired,
  dropdownOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })),
  callback: PropTypes.func.isRequired
}

export default SimpleDropdown
