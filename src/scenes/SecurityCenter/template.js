import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const SecurityCenter = () => {
  return (
    <section>
      <span>Security center page</span>
    </section>
  )
}

export default CSSModules(SecurityCenter, style)
