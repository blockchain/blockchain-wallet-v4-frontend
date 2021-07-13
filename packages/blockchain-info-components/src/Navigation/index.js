import React, { PureComponent } from 'react'
import { FormattedMessage, IntlProvider } from 'react-intl'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'
import Cookies from 'universal-cookie'

import { Color } from '../Colors/index.ts'
import { Image } from '../Images'
import Normalize8 from '../Normalize.js'
import Button from './Button'
import ButtonGroup from './ButtonGroup'
import { trackEvent } from './Events'
import Link from './Link'
import Logomark from './Logomark'
import MenuButton from './MenuButton'
import MenuDropdown from './MenuDropdown'
import throttle from './throttle.js'

const publicRuntimeConfig = {
  headerSearchURL: 'https://blockchain.com/search?search=',
  walletLoginURL: 'https://login.blockchain.com/#/login',
  walletSignupURL: 'https://login.blockchain.com/#/signup'
}
const SEARCH_URL = publicRuntimeConfig.headerSearchURL
const HIDE_HEADER_MIN_WIDTH = 768
const HIDE_HEADER_MIN_SCROLL = 100

const lightTheme = {
  main: 'white',
  secondary: `${Color('whiteFade100')}`,
  placeholder: `${Color('whiteFade800')}`,
  headerScroll: `${Color('bigStone')}`
}
const COOKIES = new Cookies()
const LOCALE = COOKIES.get('clang') || 'en'

const darkTheme = {
  main: `${Color('marketing-secondary')}`,
  secondary: `${Color('greyFade200')}`,
  placeholder: `${Color('greyFade800')}`,
  headerScroll: 'white'
}

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
  .flex-container {
    display: flex;
    margin: 0 auto;
    width: 100%;
    min-height: 2rem;
  }
`

const GlobalNav = styled.div.attrs({
  className: 'flex-container'
})`
  ${Normalize8}
  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : 'transparent'};
  position: ${props => props.position};
  z-index: 100;

  &.hidden {
    opacity: 0;
    transform: translate(0, -4rem);
    transition: transform 0.4s, opacity 0.2s;
  }

  &.visible {
    opacity: 1;
    transform: translate(0, 0);
    transition: transform 0.4s, opacity 0.2s;
  }

  &.scrollup {
    background-color: ${props => (props.navColor ? props.navColor : 'white')};
  }

  @media only screen and (max-width: 48rem) {
    position: ${props => props.position};
  }
`

const NavWrapper = styled.div.attrs({
  className: 'flex-container'
})`
  height: 4rem;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  max-width: var(--siteMaxWidth);
  padding: 0 3rem;
`

const NavInner = styled.div`
  display: flex;
  align-items: center;

  a {
    font-size: 1rem;
    font-weight: 600;
  }

  &:first-child {
    /* align logo to mobile menu */
    margin-top: 4px;
  }

  &:nth-child(3) {
    margin-left: 1rem;
    margin-right: auto;
    flex: 1 0 auto;

    > input[type='search'] {
      width: 0;
      transition: width 0.4s ease;
      background-color: transparent;
      border: none;
      outline: none;
      padding-left: 2.5rem;
      border-bottom: 2px solid transparent;
      margin-left: -1.75rem;
      margin-bottom: -1px;
      font-weight: 500;
      line-height: 2.5rem;
      cursor: pointer;
      color: ${props => (props.textColor ? props.textColor : 'white')};
      z-index: 10;

      &::-webkit-search-cancel-button {
        margin-left: 1rem;
      }

      &::placeholder {
        color: ${props =>
          props.placeholderColor ? props.placeholderColor : 'white'};
      }
    }

    .search-icon {
      fill: ${props => (props.textColor ? props.textColor : 'white')};
    }

    > input[type='search']:focus {
      width: 100%;
      border-bottom: 2px solid white;
      border-bottom: ${props =>
        props.textColor ? '2px solid ' + props.textColor : '2px solid white'};

      cursor: text;
      transition: all 0.4s ease;
    }
  }

  &.search-active {
    display: none;
  }

  @media only screen and (max-width: 48rem) {
    &:not(:first-child) {
      display: none;
    }
  }
`

const MenuButtonWrap = styled.div`
  display: none;
  z-index: 1000;

  @media only screen and (max-width: 48rem) {
    display: flex;
  }
`

const DropdownWrap = styled.div`
  h5 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: ${Color('marketing-primary')};
  }

  > ul > li {
    padding: 0.75rem 0;
  }

  > ul > li:hover h5 {
    text-decoration: underline;
  }

  > ul > li > a > p.desc {
    font-size: 0.875rem;
    color: ${Color('textBlack')};
    opacity: 0.5;
    font-weight: 500;
  }
`

const productsList = [
  {
    title: (
      <FormattedMessage id='header.products.wallet' defaultMessage='Wallet' />
    ),
    desc: (
      <FormattedMessage
        id='header.products.wallet-desc'
        defaultMessage='Send, Receive, and Trade'
      />
    ),
    link: '/wallet',
    locale: LOCALE,
    event: 'header_wallet'
  },
  {
    title: (
      <FormattedMessage
        id='header.products.blockchain_markets'
        defaultMessage='Blockchain Markets'
      />
    ),
    desc: (
      <FormattedMessage
        id='header.products.bps-desc'
        defaultMessage='Institutional Portal'
      />
    ),
    link: '/markets',
    locale: LOCALE,
    event: 'header_principal'
  },
  {
    title: (
      <FormattedMessage id='header.products.lockbox' defaultMessage='Lockbox' />
    ),
    desc: (
      <FormattedMessage
        id='header.data.lockbox-desc'
        defaultMessage='Hardware Wallet'
      />
    ),
    link: '/lockbox',
    locale: LOCALE,
    event: 'header_lockbox'
  },
  {
    title: (
      <FormattedMessage
        id='header.products.developers'
        defaultMessage='Developers'
      />
    ),
    desc: (
      <FormattedMessage
        id='header.products.developers-desc'
        defaultMessage='Access our API'
      />
    ),
    link: '/api',
    locale: LOCALE,
    event: 'header_developers'
  }
]

const dataList = [
  {
    title: <FormattedMessage id='header.data.prices' defaultMessage='Prices' />,
    desc: (
      <FormattedMessage
        id='header.data.prices-desc'
        defaultMessage='Quotes, News, and More'
      />
    ),
    link: '/prices',
    locale: LOCALE,
    event: 'header_prices'
  },
  {
    title: <FormattedMessage id='header.data.charts' defaultMessage='Charts' />,
    desc: (
      <FormattedMessage
        id='header.data.charts-desc'
        defaultMessage='Stats and Network Activity'
      />
    ),
    link: '/charts',
    locale: LOCALE,
    event: 'header_charts'
  },
  {
    title: (
      <FormattedMessage
        id='header.data.explorer'
        defaultMessage='Bitcoin Explorer'
      />
    ),
    desc: (
      <FormattedMessage
        id='header.data.explorer-desc'
        defaultMessage='Search BTC Blockchain'
      />
    ),
    link: '/explorer',
    locale: LOCALE,
    event: 'header_explorer'
  },
  {
    title: (
      <FormattedMessage
        id='header.data.explorer-bch'
        defaultMessage='Bitcoin Cash Explorer'
      />
    ),
    desc: (
      <FormattedMessage
        id='header.data.explorer-bch-desc'
        defaultMessage='Search BCH Blockchain'
      />
    ),
    link: '/explorer?currency=BCH',
    locale: LOCALE,
    event: 'header_explorer_bch'
  },
  {
    title: (
      <FormattedMessage
        id='header.data.explorer-eth'
        defaultMessage='Ethereum Explorer'
      />
    ),
    desc: (
      <FormattedMessage
        id='header.data.explorer-eth-desc'
        defaultMessage='Search ETH Blockchain'
      />
    ),
    link: '/explorer?currency=ETH',
    locale: LOCALE,
    event: 'header_explorer_eth'
  }
]

const ListWrap = items => (
  <DropdownWrap>
    <ul>
      {items.map((item, index) => {
        return (
          <li key={index}>
            <Link href={item.link} event={item.event} locale={item.locale}>
              <h5 className='title'>{item.title}</h5>
              <p className='desc'>{item.desc}</p>
            </Link>
          </li>
        )
      })}
    </ul>
  </DropdownWrap>
)

const dropdownMap = {
  products: {
    linkText: (
      <FormattedMessage
        id='header.dropdown.products'
        defaultMessage='Products'
      />
    ),
    component: ListWrap(productsList),
    onActive: () => {
      trackEvent('header_products')
    }
  },
  markets: {
    linkText: (
      <FormattedMessage id='header.dropdown.data' defaultMessage='Data' />
    ),
    component: ListWrap(dataList),
    onActive: () => {
      trackEvent('header_data')
    }
  }
}

const MobileMenuContainer = styled.div`
  background: ${Color('blue900')};
  height: auto;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  justify-content: flex-start;
  padding: 1rem 1.625rem;
  top: 0.375rem;
  right: 0.375rem;
  border-radius: var(--lgBorderRadius);
  z-index: 1000;
  min-width: 24rem;

  h5,
  ul > li > a > p.desc {
    color: white;
  }

  @media only screen and (max-width: 36em) {
    left: 0.375rem;
    min-width: 0;
  }
`

const MobileMenuItem = styled.div`
  flex: 1 1 auto;
  padding-top: 1rem;
  padding-bottom: 1rem;

  &:first-child {
    margin-top: 2px;
    margin-bottom: 1.5rem;
    padding: 0;
  }

  &:last-child {
    padding-bottom: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
`

const MobileMenu = props => {
  if (!props.active) {
    return null
  }

  return (
    <MobileMenuContainer>
      <MobileMenuItem>
        <Logomark color='white' />
      </MobileMenuItem>

      <MobileMenuItem>
        <ButtonGroup>
          <Button
            textColor='white'
            bgColor='white'
            outline
            href={publicRuntimeConfig.walletLoginURL}
            event='header_login'
          >
            <FormattedMessage id='header.login' defaultMessage='Login' />
          </Button>
          <Button
            href={publicRuntimeConfig.walletSignupURL}
            event='header_signup'
          >
            <FormattedMessage id='header.signup' defaultMessage='Sign Up' />
          </Button>
        </ButtonGroup>
      </MobileMenuItem>

      <MobileMenuItem>{ListWrap(productsList)}</MobileMenuItem>

      <MobileMenuItem>{ListWrap(dataList)}</MobileMenuItem>
    </MobileMenuContainer>
  )
}

const Spacer = styled.div`
  height: 4rem;

  @media only screen and (max-width: 48rem) {
    display: none;
  }
`

class Header extends PureComponent {
  static defaultProps = {
    searchURL: SEARCH_URL
  }

  constructor(props) {
    super(props)
    this.previousScroll = 100
  }

  state = {
    menuActive: false,
    search: false,
    showNav: true,
    searchText: ''
  }

  componentDidMount() {
    if (window) {
      window.addEventListener('scroll', this.handleScroll, true)
      window.addEventListener('resize', this.handleResize, true)
    }
  }

  componentWillUnmount() {
    if (window) {
      window.removeEventListener('scroll', this.handleScroll)
      window.removeEventListener('resize', this.handleResize)
    }
  }

  getScrollTop() {
    if (window && document) {
      let supportScrollY = window.scrollY !== undefined
      let supportPageOffset = window.pageYOffset !== undefined
      let isCSS1Compat = (document.compatMode || '') === 'CSS1Compat'
      let scrollTop = supportScrollY
        ? window.scrollY
        : supportPageOffset
        ? window.pageYOffset
        : isCSS1Compat
        ? document.documentElement.scrollTop
        : document.body.scrollTop

      return scrollTop
    }
    return undefined
  }

  handleResize = throttle(e => {
    if (window.innerWidth > 768) {
      this.setState({ menuActive: false })
    }
  }, 200)

  handleScroll = throttle(e => {
    let scrollTop = this.getScrollTop()
    if (scrollTop === undefined) {
      return
    }

    let windowHeight = window.innerHeight
    let docHeight = document.body.scrollHeight
    let windowWidth = window.innerWidth

    if (
      windowWidth >= HIDE_HEADER_MIN_WIDTH &&
      scrollTop > HIDE_HEADER_MIN_SCROLL &&
      scrollTop < docHeight - windowHeight
    ) {
      if (scrollTop > this.previousScroll) {
        this.setState({ showNav: false, scrollUp: false })
      } else {
        this.setState({ showNav: true, scrollUp: scrollTop !== 0 })
      }
    } else if (scrollTop <= HIDE_HEADER_MIN_SCROLL) {
      this.setState({ showNav: true, scrollUp: false })
    }

    this.previousScroll = scrollTop
  }, 200)

  handleMenuClick = active => {
    this.setState({ menuActive: active })
  }

  handleSearchFocus = () => {
    this.setState({ search: true })
    trackEvent('header_search')
  }

  handleSearchBlur = () => {
    this.setState({ search: false })
  }

  handleSearchChange = e => {
    this.setState({ searchText: e.target.value })
  }

  handleSearchKey = e => {
    if (e.keyCode === 13) {
      let searchText = this.state.searchText.trim()
      if (searchText.length) {
        this.setState({ searchText: '' }, () => {
          trackEvent('header_search-query')
          this.handleSearch(searchText)
        })
      }
    }
  }

  handleSearch = text => {
    document.location = this.props.searchURL + encodeURIComponent(text)
  }

  render() {
    let themeObj = this.props.theme === 'light' ? darkTheme : lightTheme
    let searchActive = this.state.search ? 'search-active' : ''
    let navVisibility = this.state.showNav ? 'visible' : 'hidden'
    let navScrollUp = this.state.scrollUp ? 'scrollup' : ''
    let navClasses = [navVisibility, navScrollUp].join(' ')
    let position = this.props.position || 'fixed'
    let dropdownTop = this.props.dropdownTop || 0
    let backgroundColor = Color('marketing-primary')

    return (
      <ThemeProvider theme={themeObj}>
        <IntlProvider>
          <div>
            <GlobalNav
              className={navClasses}
              backgroundColor={backgroundColor}
              navColor={themeObj.headerScroll}
              position={position}
            >
              <NavWrapper>
                <NavInner>
                  <Link href='https://blockchain.com' event='header_logo'>
                    <Logomark color='white' />
                  </Link>
                </NavInner>

                <NavInner>
                  <MenuDropdown dropdownTop={dropdownTop} map={dropdownMap} />
                </NavInner>

                <NavInner
                  textColor={themeObj.main}
                  placeholderColor={themeObj.placeholder}
                  className='search-default'
                >
                  <Image name='search' height='20px' width='20px' />
                  <input
                    onFocus={this.handleSearchFocus}
                    onBlur={this.handleSearchBlur}
                    onChange={this.handleSearchChange}
                    onKeyUp={this.handleSearchKey}
                    value={this.state.searchText}
                    type='search'
                    name='search'
                    placeholder='Look up blocks, transactions, hash...'
                  />
                </NavInner>

                <NavInner className={searchActive}>
                  <ButtonGroup>
                    <Button
                      bgColor={themeObj.secondary}
                      textColor={themeObj.main}
                      href={publicRuntimeConfig.walletLoginURL}
                      event='header_login'
                    >
                      <FormattedMessage
                        id='header.login'
                        defaultMessage='Login'
                      />
                    </Button>
                    <Button
                      bgColor={themeObj.secondary}
                      textColor={themeObj.main}
                      href={publicRuntimeConfig.walletSignupURL}
                      event='header_signup'
                    >
                      <FormattedMessage
                        id='header.signup'
                        defaultMessage='Sign Up'
                      />
                    </Button>
                  </ButtonGroup>
                </NavInner>

                <MobileMenu active={this.state.menuActive} />

                <MenuButtonWrap>
                  <MenuButton
                    color={themeObj.main}
                    active={this.state.menuActive}
                    callback={this.handleMenuClick}
                  />
                </MenuButtonWrap>
              </NavWrapper>
            </GlobalNav>
            {position === 'fixed' && <Spacer />}
          </div>
        </IntlProvider>
        <GlobalStyles />
      </ThemeProvider>
    )
  }
}

export default Header
