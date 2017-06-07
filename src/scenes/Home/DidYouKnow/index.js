import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const DidYouKnow = () => {
  return (
    <div styleName='did-you-know'>
      Did You Know?
    </div>
  )
}

export default CSSModules(DidYouKnow, style)
