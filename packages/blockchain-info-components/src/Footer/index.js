import React, { PureComponent } from 'react'
import { IntlProvider } from 'react-intl'
import styled, { createGlobalStyle } from 'styled-components'
import Cookies from 'universal-cookie'

import { Color } from '../Colors/index.ts'
import { Image } from '../Images'
import Link from '../Navigation/Link'
import Normalize8 from '../Normalize.js'
import { Select } from './Select'

const GlobalStyles = createGlobalStyle`
  :root {
    --siteMaxWidth: 75rem;
    --contentMaxWidth: 62rem;
    --copyMaxWidth: 42rem;

    --smScreen: 48rem;
    --mdScreen: 62rem;
    --lgScreen: 75rem;

    --smBorderRadius: 2px;
    --lgBorderRadius: 4px;
  }
`

const GlobalFooter = styled.div`
  ${Normalize8}
  background: ${Color('grey000')};
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
  padding: 1.25rem 3rem;
  color: ${Color('textBlack')};

  a {
    transition: color 0.5s, opacity 0.5s;
    font-weight: 500;
  }

  a:hover {
    color: ${Color('marketing-primary')};
    opacity: 1;
  }

  h5 {
    text-transform: uppercase;
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    letter-spacing: 1px;
  }

  @media only screen and (max-width: 48rem) {
    padding: 1.25rem 2rem;
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
    font-size: 1rem;
  }

  @media only screen and (max-width: 48rem) {
    margin-bottom: 2rem;
  }
`

const NavBadge = styled.span`
  color: white;
  background-color: ${Color('blue600')};
  padding: 0.25rem;
  margin-left: 0.75rem;
  font-size: 0.625rem;
  text-transform: uppercase;
  font-weight: 700;
  border-radius: var(--smBorderRadius);
  word-wrap: normal;
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
  background-color: ${Color('silver')} !important;
  color: white;
  transition: all 0.5s;
  margin-right: 0.75rem;
  justify-content: center;

  .social-icons {
    opacity: 0.5;
  }

  &:hover {
    background: ${Color('marketing-primary')} !important;

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

const BlueLogo = styled(Image)`
  float: right;
  margin-bottom: 2rem;

  @media only screen and (max-width: 62rem) {
    float: left;
  }
`

let supportedLanguages = {
  da: 'Danish',
  de: 'German',
  en: 'English',
  es: 'Spanish',
  fr: 'French'
}

let langItems = Object.keys(supportedLanguages).map(langKey => {
  return {
    text: supportedLanguages[langKey],
    value: langKey
  }
})

class Footer extends PureComponent {
  constructor(props) {
    super(props)
    this.cookies = new Cookies()

    this.lang = this.cookies.get('clang') || 'en'

    let langPathMatch = window.location.pathname.match(/^\/([a-z]{2})\//)
    let langPath = langPathMatch && langPathMatch[1]
    if (langPath && langPath in supportedLanguages) {
      this.lang = langPath
    }

    this.handleDropdown = this.handleDropdown.bind(this)
  }

  handleDropdown(value) {
    if (value === 'en') {
      this.cookies.remove('clang', { path: '/' })
    } else {
      this.cookies.set('clang', value, { path: '/' })
    }

    let toLocation = window.location
    let pathname = window.location.pathname
    let langPathMatch = pathname.match(/^\/([a-z]{2})\/(.*)/)
    if (langPathMatch && langPathMatch[1] in supportedLanguages) {
      toLocation =
        value === 'en'
          ? '/' + langPathMatch[2]
          : '/' + value + '/' + langPathMatch[2]
    } else {
      toLocation = value === 'en' ? pathname : '/' + value + pathname
    }
    window.setTimeout(() => {
      // trigger page refresh
      window.location.href = toLocation
    }, 1)
  }

  render() {
    return (
      <IntlProvider>
        <GlobalFooter>
          <Container>
            <SiteNav>
              <Column>
                <h5>Products</h5>
                <ul>
                  <li>
                    <Link locale={this.lang} href={'/wallet'}>
                      Wallet
                    </Link>
                  </li>
                  <li>
                    <Link locale={this.lang} href='/markets'>
                      Blockchain Markets
                    </Link>
                  </li>
                  <li>
                    <Link locale={this.lang} href={'/api'}>
                      Developers
                    </Link>
                  </li>
                </ul>
              </Column>

              <Column>
                <h5>Data</h5>
                <ul>
                  <li>
                    <Link locale={this.lang} href={'/prices'}>
                      Prices
                    </Link>
                  </li>
                  <li>
                    <Link locale={this.lang} href={'/charts'}>
                      Charts
                    </Link>
                  </li>
                  <li>
                    <Link locale={this.lang} href={'/explorer'}>
                      Bitcoin Explorer
                    </Link>
                  </li>
                  <li>
                    <Link locale={this.lang} href={'/explorer?currency=BCH'}>
                      Bitcoin Cash Explorer
                    </Link>
                  </li>
                  <li>
                    <Link locale={this.lang} href={'/explorer?currency=ETH'}>
                      Ethereum Explorer
                    </Link>
                  </li>
                </ul>
              </Column>

              <Column>
                <h5>Learn</h5>
                <ul>
                  <li>
                    <Link
                      locale={this.lang}
                      href={'/learning-portal/bitcoin-faq'}
                    >
                      What is Bitcoin
                    </Link>
                  </li>
                  <li>
                    <Link
                      locale={this.lang}
                      href={'/learning-portal/ether-basics'}
                    >
                      What is Ethereum
                    </Link>
                  </li>
                  <li>
                    <Link locale={this.lang} href={'/learning-portal'}>
                      Getting Started
                    </Link>
                  </li>
                  <li>
                    <Link href='https://blog.blockchain.com'>Blog</Link>
                  </li>
                  <li>
                    <Link locale={this.lang} href={'/research'}>
                      Research
                    </Link>
                  </li>
                </ul>
              </Column>

              <Column>
                <h5>Company</h5>
                <ul>
                  <li>
                    <Link locale={this.lang} href={'/about'}>
                      About
                    </Link>
                  </li>
                  <li>
                    <Link locale={this.lang} href={'/team'}>
                      Team
                    </Link>
                  </li>
                  <li>
                    <Link locale={this.lang} href={'/careers'}>
                      Careers
                    </Link>
                    <NavBadge>Hiring</NavBadge>
                  </li>
                  <li>
                    <Link locale={this.lang} href={'/legal'}>
                      Legal
                    </Link>
                  </li>
                </ul>
              </Column>

              <Column>
                <h5>Contact Us</h5>
                <ul>
                  <li>
                    <Link locale={this.lang} href={'/press'}>
                      Press
                    </Link>
                  </li>
                  <li>
                    <Link href='https://support.blockchain.com'>Support</Link>
                  </li>
                  <li>
                    <Link href='https://www.blockchain-status.com/'>
                      Status
                    </Link>
                  </li>
                </ul>
              </Column>

              <Column>
                <BlueLogo name='blockchain-icon' height='44px' />
                <Copyright>
                  © {new Date().getFullYear()} BLOCKCHAIN LUXEMBOURG S.A.
                </Copyright>
              </Column>
            </SiteNav>
            <LangNav>
              <Select
                transparent
                items={langItems}
                value={this.lang}
                onChange={this.handleDropdown}
              />
              <SocialLinksWrap>
                <SocialLinks href='https://twitter.com/blockchain'>
                  <Image name='twitter-white' />
                </SocialLinks>
                <SocialLinks href='https://www.linkedin.com/company/blockchain/'>
                  <Image name='linkedin-white' />
                </SocialLinks>
                <SocialLinks href='https://www.facebook.com/blockchain/'>
                  <Image name='facebook-white' />
                </SocialLinks>
              </SocialLinksWrap>
            </LangNav>
          </Container>
        </GlobalFooter>
        <GlobalStyles />
      </IntlProvider>
    )
  }
}

export default Footer
