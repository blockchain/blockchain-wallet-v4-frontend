import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const Footer = () => {
  return (
    <footer className='footer'>
      Landing footer
    </footer>
  )
}

export default CSSModules(Footer, style)
