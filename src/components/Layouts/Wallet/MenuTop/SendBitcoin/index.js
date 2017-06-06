import React from 'react'
import classNames from 'classnames'

import style from './style.scss'
import button from 'sass/elements/button.scss'
import fonts from 'sass/utilities/fonts.scss'
import typography from 'sass/utilities/typography.scss'

const SendBitcoin = () => {
  return (
    <button className={button.blank}>
      <i className={classNames(fonts.iconSend, typography.marginRight5)} />
      Send
    </button>
  )
}

export default SendBitcoin
