import React from 'react'

import style from './style.scss'

const title = 'Password Stretching (PBKDF2)'

const description = (
  <span>
    This increases the difficulty of discovering your password using a brute-force attack but slows down loading and saving your wallet.
  </span>
)

const settings = (
  <div>
    <span> 5000 </span>
    <button className='primary'>Change</button>
  </div>
)

export default {
  title, description, settings
}
