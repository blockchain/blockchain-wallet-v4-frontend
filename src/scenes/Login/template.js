import React from 'react'
import { NavLink } from 'react-router-dom'
import CSSModules from 'react-css-modules'

import Translate from 'components/Shared/Translate'
import style from './style.scss'

const Login = (props) => {
  return (
    <section styleName='login'>
      <div className='row padding-vertical-10'>
        <div className='col-md-6 left-align'>
          <Translate className='f-24 text-capitalize' translate='WELCOME_BACK' />
        </div>
        <div className='col-md-6 right-align'>
          <span className='margin-right-5'>or</span>
          <NavLink to='/register'>Sign Up</NavLink>
        </div>
      </div>
      <div className='row margin-bottom-20 border-bottom'>
        <span className='f-16 alt-font padding-vertical-10'>Sign in to your wallet below</span>
      </div>
      <div className='row'>
        <label>Wallet ID</label>
      </div>
      <div className='row padding-vertical-10'>
        <input type='text' name='guid' onChange={props.onChange} />
      </div>
      <div className='row'>
        <span className='alt-font margin-top-5'>
          Find the login link in your email, e.g.<i>blockchain.info/wallet/1111-222-333...</i>
          The series of numbers and dashes at the end of the link is your Wallet ID.
        </span>
      </div>
      <div className='row padding-vertical-10'>
        <label>Password</label>
      </div>
      <div className='row'>
        <input type='password' name='password' onChange={props.onChange} />
      </div>
      <div className='row padding-vertical-10'>
        <div className='col-md-12'>
          <button className='button-primary full-width' name='submit' onClick={props.onClick}>LOG IN</button>
        </div>
      </div>
      <div className='row padding-vertical-10'>
        <div className='col-md-12 right-align'>
          <span className='f-16 alt-font margin-right-5'>Having some trouble?</span>
          <NavLink to='/login-help'>View Options</NavLink>
        </div>
      </div>
    </section>
  )
}

export default CSSModules(Login, style)
