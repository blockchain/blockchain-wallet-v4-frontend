import React from 'react'
import CSSModules from 'react-css-modules'

import Dropdown from 'components/Shared/Dropdown'
import style from './style.scss'

const MenuTop = () => {
  return (
    <div styleName='menuTop'>
      <Dropdown />
    </div>
  )
}

export default CSSModules(MenuTop, style)
