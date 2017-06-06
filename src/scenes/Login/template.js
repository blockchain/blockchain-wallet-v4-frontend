import React from 'react'
import { NavLink } from 'react-router-dom'
import classNames from 'classnames'

import button from 'sass/elements/button.scss'
import link from 'sass/elements/link.scss'
import textbox from 'sass/elements/textbox.scss'
import typography from 'sass/utilities/typography.scss'
import style from './style.scss'

const Login = (props) => {
  return (
    <section className={style.login}>
      <div className={style.header}>
        <span className={typography.title}>Welcome back!</span>
        <div>
          <span className={classNames(typography.info, typography.marginRight5)}>or</span>
          <NavLink className={link.default} to='/register'>Sign Up</NavLink>
        </div>
      </div>
      <span className={classNames(typography.subtitle, typography.marginTop10)}>Sign in to your wallet below</span>
      <div className={style.separator} />
      <span className={typography.labelTextbox}>Wallet ID</span>
      <input className={classNames(textbox.default, typography.marginTop10)} type='text' name='guid' onChange={props.onChange} />
      <span className={classNames(typography.descriptionTextbox, typography.marginTop5)}>
        Find the login link in your email, e.g.
        <i>blockchain.info/wallet/1111-222-333...</i>
        The series of numbers and dashes at the end of the link is your Wallet ID.
      </span>
      <span className={classNames(typography.labelTextbox, typography.marginTop10)}>Password</span>
      <input className={classNames(textbox.default, typography.marginTop10)} type='password' name='password' onChange={props.onChange} />
      <button className={classNames(button.primary, typography.marginTop10)} name='submit' onClick={props.onClick}>LOG IN</button>
      <div className={style.footer}>
        <div>
          <span className={classNames(typography.info, typography.marginRight5)}>Having some trouble?</span>
          <NavLink className={link.default} to='/login-help'>View Options</NavLink>
        </div>
      </div>
    </section>
  )
}

export default Login
