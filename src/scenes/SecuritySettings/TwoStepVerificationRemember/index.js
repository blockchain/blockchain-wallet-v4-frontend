import React from 'react'

import style from './style.scss'
import typography from 'sass/utilities/typography.scss'
import button from 'sass/elements/button.scss'

const title = 'Remember 2-step Verification'

const description = (
  <span className={typography.h4}>
    Your browser will be remembered for a short period of time, allowing you to login again without having to re-authenticate.
    Disable this to require full authentication every time you login. This will not affect your current browser until you delete all cookies.
  </span>
)

const settings = (
  <div>
    <button className={button.primary}>Disable</button>
  </div>
)

export default {
  title, description, settings
}
