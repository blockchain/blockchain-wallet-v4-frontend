import React from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const DropdownItem = (props) => {
  return (
    <a styleName='dropdown-list-item' onClick={() => props.click(props.value)}>{props.text}</a>
  )
}

DropdownItem.propTypes = {
  text: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  click: PropTypes.func.isRequired
}

export default CSSModules(DropdownItem, style)
