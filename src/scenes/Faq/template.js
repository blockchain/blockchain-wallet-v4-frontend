import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const Faq = () => {
  return (
    <section styleName='faq'>
      FAQ page
    </section>
  )
}

export default CSSModules(Faq, style)
