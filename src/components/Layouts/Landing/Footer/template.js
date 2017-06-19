import React from 'react'
import CSSModules from 'react-css-modules'
import { NavLink } from 'react-router-dom'
import Translate from 'components/Shared/Translate'
import DropdownLanguage from 'components/Shared/DropdownLanguage'

import logo from 'img/blockchain-blue.svg'
import style from './style.scss'

const Footer = () => {
  return (
    <footer className='padding-vertical-40 padding-horizontal-10' styleName='footer'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-3'>
            <img src={logo} styleName='logo' />
          </div>
          <div className='col-md-2'>
            <Translate className='text-uppercase' styleName='category' translate='PRODUCTS' />
            <NavLink to='/wallet'><Translate className='text-uppercase' translate='WALLET' /></NavLink>
            <a href='https://blockchain.com/enterprise'><Translate className='text-uppercase' translate='BUSINESS' /></a>
            <a href='https://blockchain.com/research'><Translate className='text-uppercase' translate='RESEARCH' /></a>
            <a href='https://blockchain.info'><span className='text-uppercase'>.Info Explorer</span></a>
            <a href='https://support.blockchain.com'><Translate className='text-uppercase' translate='SUPPORT' /></a>
          </div>
          <div className='col-md-2'>
            <span className='text-uppercase' styleName='category' >Company</span>
            <a href='https://blockchain.com/about'><Translate className='text-uppercase' translate='ABOUT' /></a>
            <a href='https://blockchain.com/team'><Translate className='text-uppercase' translate='TEAM' /></a>
            <a href='https://blockchain.com/careers'><Translate className='text-uppercase' translate='CAREERS' /></a>
            <a href='https://blockchain.com/interview'><Translate className='text-uppercase' translate='INTERVIEWING' /></a>
            <a href='https://blockchain.com/faq'><span className='text-uppercase'>Faq</span></a>
          </div>
          <div className='col-md-2'>
            <span className='text-uppercase' styleName='category' >News</span>
            <a href='https://blockchain.com/press'><Translate className='text-uppercase' translate='PRESS' /></a>
            <a href='https://blog.blockchain.com'><Translate className='text-uppercase' translate='BLOG' /></a>
          </div>
          <div className='col-md-3'>
            <DropdownLanguage />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-10'>
            <p>2017 BLOCKCHAIN LUXEMBOURG S.A. ALL RIGHTS RESERVED.</p>
          </div>
          <div className='col-md-2'>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default CSSModules(Footer, style)
