import React from 'react'
import { NavLink } from 'react-router-dom'

import style from './style.scss'
import fonts from 'sass/utilities/fonts.scss'

const SubMenuLeftLink = (props) => {
  return (
    <li className={style.subMenuLeftLink}>
      <NavLink className={style.link} to={props.route} activeClassName={style.linkActive}>
        <span>{props.title}</span>
      </NavLink>
    </li>
  )
}

export default SubMenuLeftLink
