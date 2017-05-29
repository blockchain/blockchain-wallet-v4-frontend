import React from 'react'
import { NavLink } from 'react-router-dom'


import './style.scss'

const MenuLeftLink = (props) => {
  return (
    <li className='menu-left-link'>
      <NavLink to={props.route} activeClassName='active' exact>
        <i className={props.icon} />
        <span>{props.title}</span>
      </NavLink>
    </li>
  )
}

export default MenuLeftLink
