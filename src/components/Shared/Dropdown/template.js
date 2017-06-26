import React from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules'

import DropdownHeader from './DropdownHeader'
import DropdownItem from './DropdownItem'

import style from './style.scss'

const Dropdown = (props) => {
  return (
    <div styleName='dropdown' className={props.className}>
      { (!props.opened | !props.searchEnabled) ? (
        <button type='button' styleName='btn' onClick={props.toggle}>{props.display}</button>
      ) : (
        <input type='text' styleName='search' onChange={props.change} autoFocus />
      )}
      <div styleName={`${props.opened ? 'dropdown-list' : 'dropdown-list-closed'}`} >
        { props.items.map((item, index) =>
          (item.value == null) ? (
            <DropdownHeader key={index} text={item.text} />
          ) : (
            <DropdownItem key={index} text={item.text} value={item.value} click={props.click} />
          ))
        }
      </div>
    </div>
  )
}

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

export default CSSModules(Dropdown, style)
