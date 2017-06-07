import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const Balance = () => {
  return (
    <div styleName='balance'>
      Balance
    </div>
  )
}

export default CSSModules(Balance, style)
