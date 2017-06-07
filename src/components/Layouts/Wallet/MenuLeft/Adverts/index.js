import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const Adverts = () => {
  return (
    <div styleName='adverts'>Adverts</div>
  )
}

export default CSSModules(Adverts, style)
