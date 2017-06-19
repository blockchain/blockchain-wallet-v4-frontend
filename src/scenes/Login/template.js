import React from 'react'
import { NavLink } from 'react-router-dom'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const Login = (props) => {
  return (
    <section className='container-fluid' styleName='login'>
      <div className='row padding-vertical-10 justify-content-between align-items-center'>
        <div className='col-8'>
          <span className='f-24 capitalize padding-vertical-10'>Welcome back!</span>
        </div>
        <div className='col-4'>
          <span className='margin-right-5'>or</span>
          <NavLink to='/register'>Sign Up</NavLink>
        </div>
      </div>
      <div className='row padding-vertical-10 border-bottom'>
        <div className='col-12'>
          <span className='f-16 alt-font'>Sign in to your wallet below</span>
        </div>
      </div>
      <div className='row padding-top-10'>
        <div className='col-12'>
          <label>Wallet ID</label>
        </div>
      </div>
      <div className='row padding-bottom-10'>
        <div className='col-12'>
          <input type='text' name='guid' onChange={props.onChange} />
        </div>
      </div>
      <div className='row padding-vertical-5'>
         <div className='col-12'>
          <span className='alt-font'>
              Find the login link in your email, e.g.<i>blockchain.info/wallet/1111-222-333...</i>
              The series of numbers and dashes at the end of the link is your Wallet ID.
          </span>
        </div>
      </div>
      <div className='row'>
        <div className='col-12'>
          <label>Password</label>
        </div>
      </div>
      <div className='row padding-bottom-10'>
        <div className='col-12'>
          <input type='password' name='password' onChange={props.onChange} />
        </div>
      </div>
      <div className='row padding-vertical-10'>
        <div className='col-12'>
          <button className='button-primary full-width' name='submit' onClick={props.onClick}>LOG IN</button>
        </div>
      </div>
      <div className='row padding-vertical-10 justify-content-end'>
        <div className='col-10 col-md-7'>
          <span className='f-16 alt-font margin-right-5'>Having some trouble?</span>
          <NavLink to='/login-help'>View Options</NavLink>
        </div>
      </div>
    </section>
  )
}

export default CSSModules(Login, style)
