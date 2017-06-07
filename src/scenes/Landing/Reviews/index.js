import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const Reviews = () => {
  return (
    <section styleName='reviews'>
      Reviews section
    </section>
  )
}

export default CSSModules(Reviews, style)
