import React from 'react'

import style from './style.scss'
import typography from 'sass/utilities/typography.scss'
import button from 'sass/elements/button.scss'

const title = '2-step Verification'

const description = (
  <span className={typography.h4}>
    Protect your wallet from unauthorized access by enabling 2-Step Verification.
    You can choose to use a free app or your mobile phone number to secure your wallet.
  </span>
)

const settings = (
  <div>
    <button className={button.primary}>Enable</button>
  </div>
)

export default {
  title, description, settings
}
