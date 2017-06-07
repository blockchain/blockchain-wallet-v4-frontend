import React from 'react'
import { NavLink } from 'react-router-dom'
import CSSModules from 'react-css-modules'

import style from './style.scss'

function renderIcon (title) {
  switch (title) {
    case 'Home': return <i className='icon-home' styleName='icon' />
    case 'Transactions': return <i className='icon-tx' styleName='icon' />
    case 'Buy bitcoin': return <i className='icon-bitcoin' styleName='icon' />
    case 'Security center': return <i className='icon-lock' styleName='icon' />
    case 'Settings': return <i className='icon-settings' styleName='icon' />
    case 'Faq': return <i className='icon-help' styleName='icon' />
  }
}

const MenuLeftLink = (props) => {
  return (
    <li styleName='menu-left-link'>
      <NavLink styleName='link' to={props.route} activeClassName='link-active'>
        {renderIcon(props.title)}
        <span>{props.title}</span>
      </NavLink>
    </li>
  )
}

export default CSSModules(MenuLeftLink, style)
