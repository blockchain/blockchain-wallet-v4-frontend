import React from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const DropdownHeader = (props) => {
  return (
    <a styleName='dropdown-list-header'>{props.text}</a>
  )
}

DropdownHeader.propTypes = {
  text: PropTypes.string.isRequired
}

export default CSSModules(DropdownHeader, style)
