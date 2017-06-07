import React from 'react'
import { NavLink } from 'react-router-dom'
import CSSModules from 'react-css-modules'

import style from './style.scss'

function renderIcon (title) {
  switch (title) {
    case 'Home': return <i className='icon-home icon' />
    case 'Transactions': return <i className='icon-tx icon' />
    case 'Buy bitcoin': return <i className='icon-bitcoin icon' />
    case 'Security center': return <i className='icon-lock icon' />
    case 'Settings': return <i className='icon-settings icon' />
    case 'Faq': return <i className='icon-help icon' />
  }
}

const MenuLeftLink = (props) => {
  return (
    <li className='menu-item'>
      <NavLink className='menu' to={props.route} activeClassName='menu-active'>
        {renderIcon(props.title)}
        <span>{props.title}</span>
      </NavLink>
    </li>
  )
}

export default CSSModules(MenuLeftLink, style)
