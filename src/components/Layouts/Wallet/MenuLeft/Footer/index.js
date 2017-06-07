import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const Footer = () => {
  return (
    <div styleName='footer'>Footer</div>
  )
}

export default CSSModules(Footer, style)
