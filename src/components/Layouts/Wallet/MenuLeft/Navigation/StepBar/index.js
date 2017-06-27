import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const StepBar = () => {
  return (
    <div styleName='step-bar'>StepBar</div>
  )
}

export default CSSModules(StepBar, style)
