import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const Logout = () => {
  return (
    <a className='navigation'>Sign out</a>
  )
}

export default CSSModules(Logout, style)
