import React from 'react'

import style from './style.scss'
import typography from 'sass/utilities/typography.scss'
import button from 'sass/elements/button.scss'

const title = 'Auto Logout'

const description = (
  <span className={typography.h4}>
    After a certain period of inactivity, you will be automatically logged out of your wallet.
  </span>
)

const settings = (
  <div>
    <span className={typography.label}>
      10min
    </span>
    <button className={button.primary}>Change</button>
  </div>
)

export default {
  title, description, settings
}
