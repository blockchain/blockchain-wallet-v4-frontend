import React, { PureComponent } from 'react'
import styled from 'styled-components'
import Cookies from 'universal-cookie'

import BlueLogo from '../Images/img/logomark.svg'
import { Select } from '../Select'

const GlobalFooter = styled.div`
  background: var(--porcelain);
  position: relative;
  padding-top: 4rem;
  padding-bottom: 4rem;

  @media only screen and (max-width: 48rem) {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
`

const Container = styled.div.attrs({
  className: 'flex-container'
})`
    flex-direction: column;
    max-width: var(--siteMaxWidth);
    padding: 1.25rem 2rem;
    color: var(--textBlack);

    a {
        transition: color .5s, opacity: .5s;
        font-weight: 500;
    }

    a:hover {
        color: var(--azure);
        opacity: 1;
    }

    h5 {
        text-transform: uppercase;
        font-size: 0.875rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }
`

const SiteNav = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;

  & a {
    opacity: 0.75;
  }

  @media only screen and (max-width: 62em) {
    flex-wrap: wrap;
  }
`

const LangNav = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;

  @media only screen and (max-width: 62em) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const Column = styled.div`
  flex: 0 1 auto;
  margin-bottom: 4rem;
  line-height: 2.5rem;
  margin-right: 2rem;
  width: 12rem;

  &:last-child {
    margin-right: 0;
  }

  h5 {
    margin-bottom: 1rem;
  }

  li {
    display: block;
    word-wrap: break-word;
    margin-bottom: 1.25rem;
    line-height: 1.4;
  }

  @media only screen and (max-width: 48rem) {
    margin-bottom: 2rem;
  }
`

const NavBadge = styled.span`
  color: white;
  background-color: var(--cerulean);
  padding: 0.25rem;
  margin-left: 0.75rem;
  font-size: 0.625rem;
  text-transform: uppercase;
  font-weight: 700;
  border-radius: var(--smBorderRadius);
`

const Copyright = styled.p`
  font-size: 0.75rem;
  font-weight: 500;
  opacity: 0.4;
  text-align: right;
  clear: both;
  line-height: 1.2rem;

  @media only screen and (max-width: 62em) {
    text-align: left;
  }
`

const SocialLinksWrap = styled.div`
  display: flex;
  flex-direction: row;
`

const SocialLinks = styled.a.attrs({
  target: '_blank'
})`
  display: flex;
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 100%;
  background: var(--silver);
  color: white;
  transition: all 0.5s;
  margin-right: 0.75rem;
  justify-content: center;

  .social-icons {
    opacity: 0.5;
  }

  &:hover {
    background: var(--azure);

    .social-icons {
      opacity: 1;
    }
  }

  @media only screen and (max-width: 48rem) {
    height: 2rem;
    width: 2rem;
    margin-top: 2rem;

    img {
      padding: 0.5rem;
    }
  }
`

class Footer extends PureComponent {
  constructor (props) {
    super(props)
    this.cookies = new Cookies()
    const { intl, router } = this.props

    this.lang = this.cookies.get('blockchainlang')

    if (intl) {
      this.lang = this.lang || intl.locale
    } else {
      this.lang = this.lang || 'en'
    }

    // let langPathMatch = router.asPath.match(/^\/([a-z]{2})\//)
    // let langPath = langPathMatch && langPathMatch[1]
    // if (langPath && langPath in publicRuntimeConfig.supportedLanguages) {
    //   this.lang = langPath
    // }
  }

  handleDropdown (value) {
    this.cookies.set('blockchainlang', value, { path: '/' })
    // trigger page refresh
    window.location = window.location
  }

  render () {
    return (
      <GlobalFooter>
        <Container>
          <SiteNav>
            <Column>
              <h5>Products</h5>
              <ul>
                <li>
                  <a href='/wallet'>Wallet</a>
                </li>
                <li>
                  <a href='https://bps.blockchain.com/'>Principal Strategies</a>
                </li>
                <li>
                  <a href='http://tsukemen.io/slate/'>Developers</a>
                </li>
              </ul>
            </Column>

            <Column>
              <h5>Data</h5>
              <ul>
                <li>
                  <a href='https://blockchain.info/markets'>Markets</a>
                  <NavBadge>New</NavBadge>
                </li>
                <li>
                  <a href='https://blockchain.info/charts/'>Charts</a>
                </li>
                <li>
                  <a href='https://blockchain.info'>Explorer</a>
                  <NavBadge>Info</NavBadge>
                </li>
              </ul>
            </Column>

            <Column>
              <h5>Learn</h5>
              <ul>
                <li>
                  <a href='/learning-portal/bitcoin-faq'>What is Bitcoin</a>
                </li>
                <li>
                  <a href='/learning-portal/ether-basics'>What is Ethereum</a>
                </li>
                <li>
                  <a href='/learning-portal'>Getting Started</a>
                </li>
                <li>
                  <a href='https://blog.blockchain.com'>Blog</a>
                </li>
              </ul>
            </Column>

            <Column>
              <h5>Company</h5>
              <ul>
                <li>
                  <a href='/about'>About</a>
                </li>
                <li>
                  <a href='/team'>Team</a>
                </li>
                <li>
                  <a href='/careers'>Careers</a>
                  <NavBadge>Hiring</NavBadge>
                </li>
                <li>
                  <a href='/legal'>Legal</a>
                </li>
              </ul>
            </Column>

            <Column>
              <h5>Contact Us</h5>
              <ul>
                <li>
                  <a href='/press'>Press</a>
                </li>
                <li>
                  <a href='https://support.blockchain.com'>Support</a>
                </li>
                <li>
                  <a href='/legal/terms'>Status</a>
                </li>
                <li>
                  <a href=' '>support@blockchain.com</a>
                </li>
              </ul>
            </Column>

            <Column>
              {BlueLogo}
              <Copyright>
                © {new Date().getFullYear()} BLOCKCHAIN LUXEMBOURG S.A.
              </Copyright>
            </Column>
          </SiteNav>
          <LangNav>
            <Select transparent
              value={this.lang}
              onChange={this.handleDropdown}
              items={this.props.langItems || []}
            />
            <SocialLinksWrap>
              <SocialLinks href='https://twitter.com/blockchain'>
                <img src='/static/img/footer/twitter.svg' />
              </SocialLinks>
              <SocialLinks href='https://www.linkedin.com/company/blockchain/'>
                <img src='/static/img/footer/linkedin.svg' />
              </SocialLinks>
              <SocialLinks href='https://www.facebook.com/blockchain/'>
                <img src='/static/img/footer/facebook.svg' />
              </SocialLinks>
            </SocialLinksWrap>
          </LangNav>
        </Container>
      </GlobalFooter>
    )
  }
}

export default Footer
