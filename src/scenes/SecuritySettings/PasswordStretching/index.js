import React from 'react'

import style from './style.scss'
import typography from 'sass/utilities/typography.scss'
import button from 'sass/elements/button.scss'

const title = 'Password Stretching (PBKDF2)'

const description = (
  <span className={typography.h4}>
    This increases the difficulty of discovering your password using a brute-force attack but slows down loading and saving your wallet.
  </span>
)

const settings = (
  <div>
    <span className={typography.label}> 5000 </span>
    <button className={button.primary}>Change</button>
  </div>
)

export default {
  title, description, settings
}
