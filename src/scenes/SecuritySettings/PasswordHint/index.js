import React from 'react'

import style from './style.scss'

const title = 'Password Hint'

const description = (
  <span>
    Your Blockchain Wallet never communicates your password to our servers.
    This means we have no idea what your password is and we cannot reset it if you forget it.
    Create a memorable password hint that we can send to your verified email address in case you forget your password.
  </span>
)

const settings = (
  <div>
    <button className='primary'>Change</button>
  </div>
)

export default {
  title, description, settings
}
