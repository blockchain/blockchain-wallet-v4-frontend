import React from 'react'
import { NavLink } from 'react-router-dom'
import CSSModules from 'react-css-modules'

import Translate from 'components/Shared/Translate'
import style from './style.scss'

const Login = (props) => {
  return (
    <section styleName='login'>
      <div className='row padding-vertical-10 justify-content-between align-items-center'>
        <div className='col-8'>
          <Translate className='h4' translate='WELCOME_BACK' />
        </div>
        <div className='col-auto'>
          <Translate className='margin-right-5' translate='OR' />
          <NavLink to='/register'>
            <Translate translate='SIGN_UP' />
          </NavLink>         
        </div>
      </div>
      <div className='row padding-vertical-10 border-bottom'>
        <div className='col-12'>     
          <Translate className='h6 margin-right-5' translate='LOGIN_BELOW' />
        </div>
      </div>
      <div className='row padding-top-10'>
        <div className='col-12'>
          <Translate element='label' translate='UID' />
        </div>
      </div>
      <div className='row padding-bottom-10'>
        <div className='col-12'>
          <input type='text' name='guid' onChange={props.onChange} />
        </div>
      </div>
      <div className='row padding-vertical-5'>
        <div className='col-12'>
          <Translate styleName='small-size' translate='FIND_GUID_EXPLAIN' />
        </div>
      </div>
      <div className='row'>
        <div className='col-12'>  
          <Translate element='label' translate='PASSWORD' />
        </div>
      </div>
      <div className='row padding-bottom-10'>
        <div className='col-12'>
          <input type='password' name='password' onChange={props.onChange} />
        </div>
      </div>
      <div className='row padding-vertical-10'>
        <div className='col-12'>
          <button className='button-secondary full-width' name='submit' onClick={props.onClick}>
            <Translate element='label' translate='LOG_IN' />
          </button>
        </div>
      </div>
      <div className='row padding-vertical-10 justify-content-end'>
        <div className='col-auto'>
          <Translate className='margin-right-5' translate='HAVING_TROUBLE' />
          <NavLink to='/login-help'>
            <Translate translate='VIEW_OPTIONS' />
          </NavLink>
        </div>
      </div>
    </section>
  )
}

export default CSSModules(Login, style)
