
import React, { Component } from 'react'
import styled from 'styled-components'
import footerLogo from '../Images/img/bc-name-and-logo-dark-blue.svg'
import androidFooterLogo from '../Images/img/android-footer-logo.svg'
import appleFooterLogo from '../Images/img/apple-footer-logo.svg'
import facebookFooterLogo from '../Images/img/facebook-footer-logo.svg'
import linkedinFooterLogo from '../Images/img/linkedin-footer-logo.svg'
import twitterFooterLogo from '../Images/img/twitter-footer-logo.svg'

const Container = styled.footer`
  background: ${props => props.theme['white-blue']};
  color: ${props => props.theme['brand-primary']};
  font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 12px;
  line-height: normal;
  padding: 30px 0;
  text-transform: uppercase;
  width: 100%;
  &.hidden { display: none }
  a {
    font-weight: 300;
    &:hover { text-decoration: underline }
  }
  a, a:active, a:hover, a:visited { color: ${props => props.theme['brand-primary']} }
  .flex-container {
    display: flex;
    flex-flow: row nowrap;
    width: inherit;
    @media screen and (max-width: 768px) {
      flex-flow: row wrap;
      padding: 0 30px;
    }
    &:first-of-type {
      & > div:first-of-type {
        @media screen and (max-width: 768px) {
          margin: 0 0 10px 0;
        }
      }
    }
    &:last-of-type {
      margin-top: 30px;
      @media screen and (max-width: 768px) {
        flex-flow: column-reverse nowrap;
        margin-top: 0;
      }
    }
    & > div {
      margin: 0 35px;
      width: 160px;
      @media screen and (max-width: 768px) {
        flex-basis: 50%;
        margin: 25px 0 0 0;
        width: auto;
      }
      &:first-of-type {
        margin-left: 40px;
        @media screen and (max-width: 768px) {
          flex-basis: 100%;
          margin-left: 0;
        }
      }
      &:last-of-type {
        margin-right: 40px;
        @media screen and (max-width: 768px) {
          margin-right: 0;
        }
      }
      &.footer-logo {
        width: 175px;
        img { width: inherit }
      }
      h6 {
        color: ${props => props.theme['brand-primary']};
        font-size: 12px;
        font-weight: 600;
        line-height: normal;
        margin: 0;
        @media screen and (max-width: 768px) {
          font-size: 14px;
        }
      }
      ol {
        display: inline-flex;
        flex-flow: column wrap;
        max-height: 142px;
        list-style: none;
        margin: 0;
        padding: 0;
        @media screen and (max-width: 768px) {
          flex-flow: column nowrap;
          max-height: unset;
        }
        li {
          margin-top: 10px;
          @media screen and (max-width: 768px) {
            margin-top: 12px;
          }
          &:first-of-type {
            @media screen and (max-width: 768px) {
              margin-top: 4px;
            }
          }
          &:first-of-type, &:nth-of-type(6) {
            border-top: 1px solid ${props => props.theme['brand-primary']};
            margin-top: 3px;
            padding-top: 8px;
            @media screen and (max-width: 768px) {
              padding-top: 10px;
            }
          }
          &:nth-of-type(6) {
            @media screen and (max-width: 768px) {
              border: none;
              margin-top: 12px;
              padding-top: 0;
            }
          }
          &:nth-of-type(6), &:nth-of-type(7),
          &:nth-of-type(8), &:nth-of-type(9) {
            padding-left: 30px;
            @media screen and (max-width: 768px) {
              padding-left: 0;
            }
          }
          a {
            @media screen and (max-width: 768px) {
              font-size: 14px;
            }
            img { width: inherit }
          }
        }
      }
      .dropup {
        font-weight: 300;
        margin-top: 10px;
        &:nth-of-type(2) { margin-bottom: 10px }
        a, a:active, a:hover, a:visited { text-decoration: none }
        span.colon { font-size: 12px }
        @media screen and (max-width: 768px) {
          span { font-size: 14px }
        }
        .dropdown-menu {
          overflow: scroll;
          max-height: 450px;
        }
      }
    }
    .copyright {
      align-self: flex-end;
      color: ${props => props.theme['brand-primary']};
      flex-grow: 1;
      font-size: 10px;
      margin-right: 0;
      width: auto;
      @media screen and (max-width: 768px) {
        align-self: flex-start;
        font-size: 12px;
      }
      a {
        font-size: 10px;
        font-weight: 400;
        margin-left: 15px;
        @media screen and (max-width: 997px) {
          display: inline-block;
          margin: 5px 10px 0 0;
        }
        &:hover { text-decoration: underline }
      }
      span {
        font-weight: 300;
        @media screen and (max-width: 997px) {
          display: block;
          margin-bottom: 5px;
        }
      }
    }
    .social-media {
      width: 200px;
      @media screen and (max-width: 768px) {
        width: 285px;
      }
      a {
        float: left;
        height: 32px;
        margin: 0 10px 0 0;
        width: 32px;
        @media screen and (max-width: 768px) {
          height: 42px;
          margin: 0 15px 0 0;
          width: 42px;
        }
        &:hover { text-decoration: none }
        &:last-of-type { margin-right: 0 }
      }
    }
  }
  @media (min-width: 768px) and (min-height: 601px) {
    .bc-logo-footer {
      left: 0;
      bottom: 0;
      position: fixed;
    }
  }
  @media (min-width: 768px) and (max-height: 600px) {
    .bc-logo-footer {
      position: relative;
    }
  }
  @media (min-width: 768px) {
    .bc-logo-footer {
      height: 90px;
    }
  }
  @media (max-width: 767px) {
    .bc-logo-footer {
      img, a, .drop-up {
        margin-left: 0px;
        margin-bottom: 40px;
      }
    }
  }
`

class Footer extends Component {
  render () {
    return (
      <Container>
        <div className='flex-container'>
          <div className='footer-logo'>
            <img alt='Blockchain Logo' src={footerLogo} />
          </div>
          <div>
            <h6>Products</h6>
            <ol>
              <li><a href='https://blockchain.info/wallet'>Wallet</a></li>
              <li><a href='https://blockchain.info/api'>API</a></li>
              <li><a href='https://blockchain.com/enterprise'>Business</a></li>
              <li><a href='https://blockchain.com/thunder'>Thunder</a></li>
              <li><a href='https://blockchain.com/research'>Research</a></li>
              <li><a href='https://blockchain.info'>Explorer</a></li>
              <li><a href='https://blockchain.info/charts'>Charts</a></li>
              <li><a href='https://blockchain.info/markets'>Markets</a></li>
              <li><a href='https://blockchain.info/stats'>Stats</a></li>
            </ol>
          </div>
          <div>
            <h6>Company</h6>
            <ol>
              <li><a href='https://blockchain.com/about'>About</a></li>
              <li><a href='https://blockchain.com/team'>Team</a></li>
              <li><a href='https://blockchain.com/careers'>Careers</a></li>
              <li><a href='https://blockchain.com/interview'>Interviewing</a></li>
              <li><a href='https://blockchain.com/faq'>FAQ</a></li>
              <li><a href='https://blockchain.com/press'>Press</a></li>
              <li><a href='https://blog.blockchain.com'>Blog</a></li>
            </ol>
          </div>
          <div>
            <h6>Support</h6>
            <ol>
              <li><a href='https://support.blockchain.com'>Help Center</a></li>
              <li><a href='https://blog.blockchain.com/category/tutorials-and-guides/'>Tutorials</a></li>
              <li><a href='https://blockchain.info/wallet/bitcoin-faq'>Learning Portal</a></li>
              <li><a href='https://www.blockchain-status.com'>Status</a></li>
            </ol>
          </div>
        </div>
        <div className='flex-container'>
          <div className='copyright'>
            <span>&copy;&nbsp;2018 Blockchain Luxembourg S.A. All Rights Reserved.</span>
            <a href='https://blockchain.com/privacy'>Privacy</a>
            <a href='https://blockchain.com/terms'>Terms</a>
            <a href='/https://blockchain.com/legal'>Law Enforcement Guide</a>
            <a href='https://blockchain.info/advertise'>Advertise</a>
          </div>
          <div className='social-media'>
            <a href='https://play.google.com/store/apps/details?id=piuk.blockchain.android&hl=en'>
              <img alt='Android App Icon' src={androidFooterLogo} />
            </a>
            <a href='https://itunes.apple.com/us/app/blockchain-bitcoin-wallet/id493253309?mt=8'>
              <img alt='iOS App Icon' src={appleFooterLogo} />
            </a>
            <a href='https://twitter.com/blockchain'>
              <img alt='Twitter Icon' src={twitterFooterLogo} />
            </a>
            <a href='https://www.linkedin.com/company/blockchain'>
              <img alt='LinkedIn Icon' src={linkedinFooterLogo} />
            </a>
            <a href='https://www.facebook.com/blockchain/'>
              <img alt='Facebook Icon' src={facebookFooterLogo} />
            </a>
          </div>
        </div>
      </Container>
    )
  }
}

export default Footer
