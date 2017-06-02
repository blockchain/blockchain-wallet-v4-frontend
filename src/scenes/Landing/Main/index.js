import React from 'react'
import { Link } from 'react-router-dom'

import style from './style.scss'

const Main = () => {
  return (
    <section className={style.main}>
      Main section
      <Link to='/login'>Login</Link>
      <Link to='/register'>Create Wallet</Link>
    </section>
  )
}

export default Main
