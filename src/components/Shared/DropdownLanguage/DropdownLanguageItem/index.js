import React from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const DropdownLanguageItem = (props) => {
  return (
    <a className='dropdown-item' styleName='item' onClick={() => props.clickItem(props.cultureCode)}>{props.name}</a>
  )
}

DropdownLanguageItem.propTypes = {
  cultureCode: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  clickItem: PropTypes.func.isRequired
}

export default CSSModules(DropdownLanguageItem, style)
