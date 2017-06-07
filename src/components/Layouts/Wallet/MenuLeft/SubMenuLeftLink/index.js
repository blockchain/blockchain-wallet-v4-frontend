import React from 'react'
import CSSModules from 'react-css-modules'
import { NavLink } from 'react-router-dom'

import style from './style.scss'

const SubMenuLeftLink = (props) => {
  return (
    <li styleName='sub-menu-left-link'>
      <NavLink styleName='link' to={props.route} activeClassName='link-active'>
        <span>{props.title}</span>
      </NavLink>
    </li>
  )
}

export default CSSModules(SubMenuLeftLink, style)
