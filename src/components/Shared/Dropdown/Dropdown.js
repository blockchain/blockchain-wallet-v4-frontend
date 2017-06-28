import React from 'react'
import PropTypes from 'prop-types'
import DropdownButton from './DropdownButton'
import DropdownHeader from './DropdownHeader'
import DropdownItem from './DropdownItem'
import DropdownList from './DropdownList'
import DropdownSearch from './DropdownSearch'
import DropdownWrapper from './DropdownWrapper'

const Dropdown = (props) => (
  <DropdownWrapper className={props.className}>
    {!props.opened || !props.searchEnabled
      ? (<DropdownButton onClick={props.toggle}>{props.display}</DropdownButton>)
      : (<DropdownSearch onChange={props.change} />)}
    <DropdownList opened={props.opened}>
      {props.items.map((item, index) =>
        item.value == null
          ? (<DropdownHeader key={index}>{item.text}</DropdownHeader>)
          : (<DropdownItem key={index} onClick={() => props.click(item.value)}>{item.text}</DropdownItem>))}
    </DropdownList>
  </DropdownWrapper>
)

Dropdown.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    value: PropTypes.string,
    group: PropTypes.string
  })),
  display: PropTypes.string.isRequired,
  opened: PropTypes.bool.isRequired,
  searchEnabled: PropTypes.bool.isRequired,
  change: PropTypes.func.isRequired,
  click: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
  className: PropTypes.string
}

export default Dropdown
