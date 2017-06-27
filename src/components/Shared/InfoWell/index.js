import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const InfoWell = ({ children }) => (
  <div styleName='info-well'>
    {children}
  </div>
)

export default CSSModules(InfoWell, style)
