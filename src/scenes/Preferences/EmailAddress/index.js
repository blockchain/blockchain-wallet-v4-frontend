import React from 'react'

import style from './style.scss'
import typography from 'sass/utilities/typography.scss'
import button from 'sass/elements/button.scss'

const title = 'Email Address'

const description = (
  <span className={typography.h4}>
    Your verified email address is used to send login codes when suspicious or unusual activity is detected,
    to remind you of your wallet login ID, and to send bitcoin payment alerts when you receive funds.
  </span>
)

const settings = (
  <div>
    <span className={typography.label}>test@example.com</span>
    <button className={button.primary}>Change</button>
  </div>
)

export default {
  title, description, settings
}
