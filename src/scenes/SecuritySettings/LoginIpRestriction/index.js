import React from 'react'

import style from './style.scss'

const title = 'Login IP Restriction'

const description = (
  <span>
    Only allow login from IP address in the whitelist. If you do not have a static IP address, this may lock you out of your wallet.
    If you have verified your email address, you will be notified of any suspicious login attempts.
  </span>
)

const settings = (
  <div>
    <button className='primary'>Enable</button>
  </div>
)

export default {
  title, description, settings
}
