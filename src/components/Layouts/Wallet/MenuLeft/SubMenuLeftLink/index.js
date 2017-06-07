import React from 'react'
import CSSModules from 'react-css-modules'
import { NavLink } from 'react-router-dom'

import style from './style.scss'

const SubMenuLeftLink = (props) => {
  return (
    <li className='menu-sub-item'>
      <NavLink className='menu-sub' to={props.route} activeClassName='menu-sub-active'>
        <span>{props.title}</span>
      </NavLink>
    </li>
  )
}

export default CSSModules(SubMenuLeftLink, style)
