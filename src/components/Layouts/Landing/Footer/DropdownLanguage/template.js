import React from 'react'
import PropTypes from 'prop-types'

import { DropdownButton, MenuItem } from 'components/Shared/Dropdown'

const DropdownLanguage = (props) => {
  return (
    <DropdownButton bsStyle='primary' title={props.display} isOpen={props.dropdownOpen} toggle={props.toggle} dropup>
      { props.items.map(function (item, index) {
        return (<MenuItem tag='a' key={index} onClick={() => props.callback(item.value)}>{item.text}</MenuItem>)
      })}
    </DropdownButton>
  )
}

DropdownLanguage.PropTypes = {
  dropdownOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })),
  callback: PropTypes.func.isRequired
}

export default DropdownLanguage
