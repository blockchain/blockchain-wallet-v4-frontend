import React from 'react'

import style from './style.scss'

const title = 'Mobile Number'

const description = (
  <span>
    Your mobile phone can be used to enable two-factor authentication,
    helping to secure your wallet from unauthorized access, and to send bitcoin payment alerts when you receive funds.
  </span>
)

const settings = (
  <div>
    <span>+447824704553</span>
    <button className='primary'>Change</button>
  </div>
)

export default {
  title, description, settings
}
