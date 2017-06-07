import React from 'react'
import { NavLink } from 'react-router-dom'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const Login = (props) => {
  return (
    <section styleName='login'>
      <div styleName='header'>
        <span className='title'>Welcome back!</span>
        <div>
          <span className='info margin-right-5'>or</span>
          <NavLink className='default' to='/register'>Sign Up</NavLink>
        </div>
      </div>
      <span className='subtitle margin-top-10'>Sign in to your wallet below</span>
      <div styleName='separator' />
      <span className='label-textbox'>Wallet ID</span>
      <input className='default margin-top-10' type='text' name='guid' onChange={props.onChange} />
      <span className='description-textbox margin-top-5'>
        Find the login link in your email, e.g.
        <i>blockchain.info/wallet/1111-222-333...</i>
        The series of numbers and dashes at the end of the link is your Wallet ID.
      </span>
      <span className='label-textbox margin-top-10'>Password</span>
      <input className='default margin-top-10' type='password' name='password' onChange={props.onChange} />
      <button className='primary margin-top-10' name='submit' onClick={props.onClick}>LOG IN</button>
      <div styleName='footer'>
        <div>
          <span className='info margin-right-5'>Having some trouble?</span>
          <NavLink className='default' to='/login-help'>View Options</NavLink>
        </div>
      </div>
    </section>
  )
}

export default CSSModules(Login, style)
