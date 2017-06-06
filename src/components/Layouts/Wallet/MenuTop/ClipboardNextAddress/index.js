import React from 'react'

import style from './style.scss'
import button from 'sass/elements/button.scss'
import fonts from 'sass/utilities/fonts.scss'
import typography from 'sass/utilities/typography.scss'

const ClipboardNextAddress = () => {
  return (
    <button className={button.blankRight}>
      <i className={fonts.tiClipboard} />
    </button>
  )
}

export default ClipboardNextAddress
