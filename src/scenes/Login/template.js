import React from 'react'
import { NavLink } from 'react-router-dom'

import button from 'sass/elements/button.scss'
import link from 'sass/elements/link.scss'
import textbox from 'sass/elements/textbox.scss'
import typography from 'sass/utilities/typography.scss'
import style from './style.scss'

const Login = (props) => {
  return (
    <section className={style.login}>
      <div className={style.header}>
        <span className={typography.h3}>Welcome Back!</span>
        <div>
          <span className={typography.h5}>or</span>
          <NavLink className={link.default} to='/register'>Sign Up</NavLink>
        </div>
      </div>
      <span className={typography.h4}>Sign in to your wallet below</span>
      <div className={style.separator} />
      <span className={typography.label}>Wallet ID</span>
      <input className={textbox.default} type='text' name='guid' onChange={props.onChange} />
      <span className={typography.h5}>
        Find the login link in your email, e.g.
        <i>blockchain.info/wallet/1111-222-333...</i>
        The series of numbers and dashes at the end of the link is your Wallet ID.
      </span>
      <span className={typography.label}>Password</span>
      <input className={textbox.default} type='password' name='password' onChange={props.onChange} />
      <button className={button.primary} name='submit' onClick={props.onClick}>LOG IN</button>
      <div className={style.footer}>
        <div>
          <span className={typography.h4}>Having some trouble?</span>
          <NavLink className={link.default} to='/login-help'>View Options</NavLink>
        </div>
      </div>
    </section>
  )
}

export default Login
