import React from 'react'
import PropTypes from 'prop-types'

import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'components/Shared/Dropdown'

const DropdownLanguage = (props) => {
  return (
    <Dropdown isOpen={props.dropdownOpen} toggle={props.toggle} dropup>
      <DropdownToggle caret>
        {props.display}
      </DropdownToggle>
      <DropdownMenu>
        { props.items.map(function (item, index) {
          return (<DropdownItem tag='a' key={index} onClick={() => props.callback(item.value)}>{item.text}</DropdownItem>)
        })}
      </DropdownMenu>
    </Dropdown>
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
