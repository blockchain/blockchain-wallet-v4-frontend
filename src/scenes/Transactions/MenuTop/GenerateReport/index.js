import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const GenerateReport = () => {
  return (
    <div styleName='generate-report'>
      Generate Report
    </div>
  )
}

export default CSSModules(GenerateReport, style)
