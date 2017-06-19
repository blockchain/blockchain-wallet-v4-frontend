import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const Logout = () => {
  return (
    <li className='nav-item active'>
      <a className='nav-link' href='#'>Sign out</a>
    </li>
  )
}

export default CSSModules(Logout, style)
