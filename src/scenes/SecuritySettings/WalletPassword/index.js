import React from 'react'

import style from './style.scss'

const title = 'Wallet Password'

const description = (
  <span>
    Your password is never shared with our servers, which means we cannot help reset your password if you forget it.
    Make sure you write down your recovery phrase which can restore access to your wallet in the event of a lost password.
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
