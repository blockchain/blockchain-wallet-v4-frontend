import React from 'react'
import { FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'

const Login = (props) => {
  return (
    <section>
      <div className='row padding-vertical-10 justify-content-between align-items-center'>
        <div className='col-8'>
          <div className='h4 text-capitalize'>
            <FormattedMessage id='scenes.login.welcome' defaultMessage='Welcome back !' />
          </div>
        </div>
        <div className='col-auto flex-row justify-content-start align-items-center'>
          <div className='d-inline-flex margin-right-5'>
            <FormattedMessage id='scenes.login.or' defaultMessage='or' />
          </div>
          <NavLink className='d-inline-flex default' to='/register'>
            <FormattedMessage id='scenes.login.register' defaultMessage='Sign Up' />
          </NavLink>
        </div>
      </div>
      <div className='row padding-vertical-10 border-bottom'>
        <div className='col-12'>
          <div className='h6 margin-right-5'>
            <FormattedMessage id='scenes.login.explain' defaultMessage='Sign in to your wallet below' />
          </div>
        </div>
      </div>
      <div className='row padding-top-10'>
        <div className='col-12'>
          <div className='h6'>
            <FormattedMessage id='scenes.login.uid' defaultMessage='Wallet ID' />
          </div>
        </div>
      </div>
      <div className='row padding-bottom-10'>
        <div className='col-12'>
          <input type='text' name='guid' onChange={props.onChange} />
        </div>
      </div>
      <div className='row padding-vertical-5'>
        <div className='col-12'>
          <div styleName='small-size'>
            <FormattedMessage id='scenes.login.info' defaultMessage='Find the login link in your email, ' />
            <i><FormattedMessage id='scenes.login.info2' defaultMessage='e.g. blockchain.info/wallet/1111-222-333...' /></i>
            <FormattedMessage id='scenes.login.info3' defaultMessage='The series of numbers and dashes at the end of the link is your Wallet ID.' />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-12'>
          <div className='h6'>
            <FormattedMessage id='scenes.login.password' defaultMessage='Password' />
          </div>
        </div>
      </div>
      <div className='row padding-bottom-10'>
        <div className='col-12'>
          <input type='password' name='password' onChange={props.onChange} />
        </div>
      </div>
      <div className='row padding-vertical-10'>
        <div className='col-12'>
          <button className='button-secondary full-width text-uppercase' name='submit' onClick={props.onClick}>
            <FormattedMessage id='scenes.login.signin' defaultMessage='Log in' />
          </button>
        </div>
      </div>
      <div className='row padding-vertical-10 justify-content-end'>
        <div className='col-auto'>
          <div className='d-inline-flex margin-right-5'>
            <FormattedMessage id='scenes.login.troubles' defaultMessage='Having some troubles?' />
          </div>
          <NavLink className='d-inline-flex default' to='/login-help'>
            <FormattedMessage id='scenes.login.options' defaultMessage='View options' />
          </NavLink>
        </div>
      </div>
    </section>
  )
}

export default Login
