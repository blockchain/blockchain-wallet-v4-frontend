import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const BalanceSummary = () => {
  return (
    <div styleName='balance-summary'>
      Balances
    </div>
  )
}

export default CSSModules(BalanceSummary, style)
