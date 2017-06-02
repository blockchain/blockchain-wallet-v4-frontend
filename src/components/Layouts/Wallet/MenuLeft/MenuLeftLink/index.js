import React from 'react'
import { NavLink } from 'react-router-dom'

import style from './style.scss'
import fonts from 'sass/utilities/fonts.scss'

function renderIcon (title) {
  switch (title) {
    case 'Home': return <i className={`${fonts.iconHome} ${style.icon}`} />
    case 'Transactions': return <i className={`${fonts.iconTx} ${style.icon}`} />
    case 'Buy bitcoin': return <i className={`${fonts.iconBitcoin} ${style.icon}`} />
    case 'Security center': return <i className={`${fonts.iconLock} ${style.icon}`} />
    case 'Settings': return <i className={`${fonts.iconSettings} ${style.icon}`} />
    case 'Faq': return <i className={`${fonts.iconHelp} ${style.icon}`} />
  }
}

const MenuLeftLink = (props) => {
  return (
    <li className={style.menuLeftLink}>
      <NavLink className={style.link} to={props.route} activeClassName={style.linkActive}>
        {renderIcon(props.title)}
        <span>{props.title}</span>
      </NavLink>
    </li>
  )
}

export default MenuLeftLink
