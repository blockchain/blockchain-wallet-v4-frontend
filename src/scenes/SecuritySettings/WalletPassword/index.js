import React from 'react'

import style from './style.scss'
import typography from 'sass/utilities/typography.scss'
import button from 'sass/elements/button.scss'

const title = 'Wallet Password'

const description = (
  <span className={typography.h4}>
    Your password is never shared with our servers, which means we cannot help reset your password if you forget it.
    Make sure you write down your recovery phrase which can restore access to your wallet in the event of a lost password.
  </span>
)

const settings = (
  <div>
    <button className={button.primary}>Change</button>
  </div>
)

export default {
  title, description, settings
}
