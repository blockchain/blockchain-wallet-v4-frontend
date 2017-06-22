import React from 'react'
import CSSModules from 'react-css-modules'
import { FormattedMessage } from 'react-intl'
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
            {/*<Translate className='text-uppercase' styleName='category' translate='PRODUCTS' />*/}
            <FormattedMessage id='components.layouts.landing.footer.products' defaultMessage='Products' />
            <NavLink to='/wallet'><Translate className='text-uppercase' translate='WALLET' styleName='link' /></NavLink>
            <a href='https://blockchain.com/enterprise'><Translate className='text-uppercase' styleName='link' translate='BUSINESS' /></a>
            <a href='https://blockchain.com/research'><Translate className='text-uppercase' styleName='link' translate='RESEARCH' /></a>
            <a href='https://blockchain.info'><span className='text-uppercase' styleName='link'>.Info Explorer</span></a>
            <a href='https://support.blockchain.com'><Translate className='text-uppercase' styleName='link' translate='SUPPORT' /></a>
          </div>
          <div className='col-md-2'>
            <span className='text-uppercase' styleName='category'>Company</span>
            <a href='https://blockchain.com/about'><Translate className='text-uppercase' styleName='link' translate='ABOUT' /></a>
            <a href='https://blockchain.com/team'><Translate className='text-uppercase' styleName='link' translate='TEAM' /></a>
            <a href='https://blockchain.com/careers'><Translate className='text-uppercase' styleName='link' translate='CAREERS' /></a>
            <a href='https://blockchain.com/interview'><Translate className='text-uppercase' styleName='link' translate='INTERVIEWING' /></a>
            <a href='https://blockchain.com/faq'><span className='text-uppercase' styleName='link'>Faq</span></a>
          </div>
          <div className='col-md-2'>
            <span className='text-uppercase' styleName='category'>News</span>
            <a href='https://blockchain.com/press'><Translate className='text-uppercase' styleName='link' translate='PRESS' /></a>
            <a href='https://blog.blockchain.com'><Translate className='text-uppercase' styleName='link' translate='BLOG' /></a>
          </div>
          <div className='col-md-3'>
            <DropdownLanguage styleName='dropdown' />
          </div>
        </div>
        <div className='row padding-top-20'>
          <div className='col-md-10'>
            <h6>2017 BLOCKCHAIN LUXEMBOURG S.A. ALL RIGHTS RESERVED.</h6>
          </div>
          <div className='col-md-2'>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default CSSModules(Footer, style)
