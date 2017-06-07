import React from 'react'

import style from './style.scss'

const title = 'Email Address'

const description = (
  <span>
    Your verified email address is used to send login codes when suspicious or unusual activity is detected,
    to remind you of your wallet login ID, and to send bitcoin payment alerts when you receive funds.
  </span>
)

const settings = (
  <div>
    <span>test@example.com</span>
    <button className='primary'>Change</button>
  </div>
)

export default {
  title, description, settings
}
