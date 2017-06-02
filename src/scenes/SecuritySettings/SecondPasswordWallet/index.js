import React from 'react'

import style from './style.scss'
import typography from 'sass/utilities/typography.scss'
import button from 'sass/elements/button.scss'

const title = 'Second Password Wallet'

const description = (
  <span className={typography.h4}>
    For additional security, you can choose a second password that is asked whenever you want to spend bitcoins.
    Beware that there is no password reset functionality.
  </span>
)

const settings = (
  <div>
    <button className={button.primary}>Set Second Password</button>
  </div>
)

export default {
  title, description, settings
}
