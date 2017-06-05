import React from 'react'

import style from './style.scss'
import button from 'sass/elements/button.scss'
import fonts from 'sass/utilities/fonts.scss'

const SendBitcoin = () => {
  return (
    <button className={button.blank}>
      <i className={fonts.iconSend} />
      <span>Send</span>
    </button>
  )
}

export default SendBitcoin
