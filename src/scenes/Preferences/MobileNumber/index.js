import React from 'react'

import style from './style.scss'
import typography from 'sass/utilities/typography.scss'
import button from 'sass/elements/button.scss'

const title = 'Mobile Number'

const description = (
  <span className={typography.h4}>
    Your mobile phone can be used to enable two-factor authentication,
    helping to secure your wallet from unauthorized access, and to send bitcoin payment alerts when you receive funds.
  </span>
)

const settings = (
  <div>
    <span className={typography.label}>+447824704553</span>
    <button className={button.primary}>Change</button>
  </div>
)

export default {
  title, description, settings
}
