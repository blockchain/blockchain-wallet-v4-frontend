import React from 'react'
import CSSModules from 'react-css-modules'

import Translate from 'components/Shared/Translate'

import style from './style.scss'

const Logout = () => {
  return (
    <li className='nav-item active'>
      <a className='nav-link' href='#'>
        <Translate translate='SIGNOUT' />
      </a>
    </li>
  )
}

export default CSSModules(Logout, style)
