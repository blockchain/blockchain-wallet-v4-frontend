
import React, { Component } from 'react'
import styled from 'styled-components'
import SearchIcon from '../Images/img/search.svg'
import Logo from '../Images/img/blockchain-vector.svg'

const Wrapper = styled.div`
  button:focus { outline: none !important }

  nav {
    background: rgba(0, 74, 124, 1);
    font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    height: 90px;
    position: fixed;
    width: 100%;
    z-index: 99;
  }

  body.static-nav nav {
    left: auto;
    position: static;
    top: auto;
  }

  /* NAVIGATION STATES */

  nav, nav.open { transition: height .25s, background .25s ease-in-out }

  nav.open,
  nav.scrolling:hover,
  nav.searching,
  body.opaque-nav nav, nav.opaque { background: rgba(0, 74, 124, 1) }

  nav.open { height: 175px }
  nav.open .igation { overflow: visible }

  nav.scrolling { background: rgba(0, 74, 124, 0.98) }

  nav ul { list-style: none }

  @media screen and (min-width: 1025px) {
    nav:hover { background: rgba(0, 74, 124, 1) }
  }

  /* NAVIGATION ITEMS */

  nav .igation {
    align-items: center;
    display: flex;
    flex-flow: row nowrap;
    font-weight: 400;
    height: 90px;
    justify-content: flex-start;
    margin: 0;
    overflow: hidden;
    padding: 0 40px;
  }

  nav .igation > li:nth-of-type(1) { order: 1 } /* BLOCKCHAIN LOGO */
  nav .igation > li:nth-of-type(2) { order: 2 } /* WALLET */
  nav .igation > li:nth-of-type(3) { order: 3 } /* DATA */
  nav .igation > li:nth-of-type(4) { order: 4 } /* API */
  nav .igation > li:nth-of-type(5) { order: 5 } /* ABOUT */
  nav .igation > li:nth-of-type(6) { order: 6 } /* FLEXIBLE SPACE */
  nav .igation > li:nth-of-type(7) { order: 7 } /* SEARCH BAR */
  nav .igation > li:nth-of-type(8) { order: 8 } /* GET FREE WALLET BUTTON */

  nav .igation > li:first-of-type { /* BLOCKCHAIN LOGO */
    margin-right: 30px;
    opacity: 1 !important;
  }

  nav .igation > li:last-of-type { margin-left: 25px } /* GET FREE WALLET BUTTON */

  /* NAVIGATION ITEM LINKS */

  nav .igation > li > a,
  nav .igation > li > a:hover,
  nav .igation > li > a:visited {
    color: #fff;
    position: relative;
    text-decoration: none;
    text-transform: uppercase;
    z-index: 1;
  }

  /* NAVIGATION ITEMS WITH CHILDREN */

  nav .igation > li.with-children {
    border-radius: 2px 2px 0 0 !important;
    padding: 0 40px 0 20px;
    position: relative;
  }

  nav .igation > li.with-children:hover ul {
    background: rgba(255, 255, 255, .08);
    transition: background .4s ease-in;
  }

  nav .igation > li.with-children > a { font-size: 13px }

  /* NAVIGATION ITEMS WITH CHILDREN STATES */

  nav .igation > li.with-children:hover ul li {
    height: 18px;
    transition: height .25s ease-in;
  }

  nav .igation > li.with-children:hover ul li a {
    opacity: .6;
    transition: opacity .2s ease-in;
    transition-delay: .1s;
  }

  /* NAVIGATION ITEMS WITH CHILDREN LIST */

  nav .igation ul {
    background: rgba(255, 255, 255, 0);
    height: 150px;
    left: 0;
    padding: 0;
    position: absolute;
    top: -10px;
    min-width: 90px;
    padding-top: 40px;
  }

  nav .igation ul li {
    margin: 6px 0;
    height: 0;
    transition: height .25s ease-out;
  }

  nav .igation ul li:first-of-type { margin-top: 0 }

  /* NAVIGATION ITEM CHILDREN LINKS */

  nav .igation ul li a {
    color: #fff;
    display: block;
    font-size: 12px;
    font-weight: 300;
    opacity: 0;
    padding-left: 20px;
  }

  /* NAVIGATION ITEM CHILDREN LINK STATES */

  nav .igation ul li:hover a,
  nav .igation ul li:hover a:active,
  nav .igation ul li:hover a:visited {
    text-decoration: none;
  }

  nav .igation ul li:hover a:focus { outline: none !important }

  nav .igation ul li:hover a {
    opacity: 1 !important;
    transition: opacity .2s ease-in;
  }

  /* NAVIGATION FLEXIBLE SPACER */

  nav .igation > li.flex-space { flex-grow: 1 }

  /* BLOCKCHAIN LOGO */

  .bc-logo { display: block }

  .bc-logo img {
    height: 21px;
    width: 170px;
  }

  /* SEARCH BAR */

  .search-bar {
    background: rgba(255, 255, 255, .05) url(${SearchIcon}) no-repeat 10px center;
    background-size: 14px;
    border: 1px solid #fff;
    border-radius: 16px;
    color: #fff;
    font-size: 14px;
    font-weight: 300;
    height: 32px;
    line-height: 14px;
    padding: 0 10px 2px 32px;
    position: relative;
    width: 260px;

    &:focus {
      background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 41.38 42.38'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%23979797;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3EAsset 2%3C/title%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='Layer_1-2' data-name='Layer 1'%3E%3Cg id='surface1'%3E%3Cpath className='cls-1' d='M19.18.13a17,17,0,1,0,6.92,31.21L36.25,41.5a3,3,0,0,0,4.25,0h0a3,3,0,0,0,0-4.25l-10-10a16.88,16.88,0,0,0,3.37-12.36A17,17,0,0,0,19.18.13ZM17,4A13,13,0,1,1,4,17,13,13,0,0,1,17,4Z'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E") no-repeat 10px center;
      background-size: 14px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .1);
      color: #454545;
      outline: none;
      padding: 0 10px 0 32px;
    }

    &::placeholder { /* Chrome 57, Firefox 51, Opera 44, Safari 10.1 */
      color: #fff;
      font-size: 11px;
      font-weight: 300;
      line-height: 30px;
      text-transform: uppercase;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    &::-webkit-input-placeholder { /* Safari */
      line-height: 20px;
    }

    &::-moz-placeholder { /* Firefox < 51 */
      line-height: 30px;
      opacity: 1;
    }

    &:-ms-input-placeholder { /* IE 10, 11 */
      color: #fff;
      font-size: 11px;
      font-weight: 300;
      line-height: normal;
      text-transform: uppercase;
    }

    &::-ms-input-placeholder { /* MS EDGE */
      color: #fff;
      font-size: 11px;
      font-weight: 300;
      line-height: normal;
      text-transform: uppercase;
    }
  }

  /* GET FREE WALLET BUTTON */

  .wallet-button {
    background: #00aee6;
    border-radius: 16px !important;
    display: block;
    font-size: 12px;
    height: 32px;
    letter-spacing: normal;
    line-height: 12px;
    padding: 11px 20px !important;
    text-align: center;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .menu-button,
  .search-button,
  nav.open .search-button { display: none }

  /* IN-BETWEEN OPTIMIZATIONS */

  @media screen and (min-width: 1024px) and (max-width: 1155px) {
    nav .igation > li.with-children { padding-right: 20px }
  }

  /* MOBILE NAVIGATION */

  @media screen and (max-width: 1024px) {
    nav, nav.searching { transition: height 450ms, background 450ms ease-in-out }

    nav.open {
      transition: height 450ms;
      height: 100%;
    }

    nav.open .igation { height: auto }

    nav.searching, nav.searching .igation { height: 126px; }

    nav .igation {
      flex-flow: row wrap;
      height: 60px;
      padding: 35px 0 0 0;
    }

    nav .igation > li:nth-of-type(1) { order: 1 } /* BLOCKCHAIN LOGO */
    nav .igation > li:nth-of-type(2) { order: 3 } /* WALLET */
    nav .igation > li:nth-of-type(3) { order: 4 } /* DATA */
    nav .igation > li:nth-of-type(4) { order: 5 } /* API */
    nav .igation > li:nth-of-type(5) { order: 6 } /* ABOUT */
    nav .igation > li:nth-of-type(6) { order: 7 } /* FLEXIBLE SPACE */
    nav .igation > li:nth-of-type(7) { order: 2 } /* SEARCH BAR */
    nav .igation > li:nth-of-type(8) { order: 8 } /* GET FREE WALLET BUTTON */

    nav .igation > li:first-of-type { width: 100% }

    nav .igation > li:nth-of-type(7) { width: 100% }

    nav.open .igation > li:first-of-type { margin-bottom: 30px }
    nav.open .igation > li:nth-of-type(7) { display: none }

    nav .igation > li ul { background: none !important }

    nav .igation > li.with-children {
      margin: 0;
      min-height: 170px;
      opacity: 0;
      padding-left: 40px;
      width: 50%;
    }

    nav.open .igation > li.with-children {
      opacity: 1;
      transition: opacity 400ms ease-in;
      transition-delay: 100ms;
    }

    nav.open .igation > li.with-children > a:after {
      color: #10ADE4;
      font-family: 'icomoon';
      font-size: 14px;
      font-style: normal;
      font-variant: normal;
      font-weight: normal;
      padding-left: 8px;
      speak: none;
      text-transform: none;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    nav .igation ul {
      left: 40px;
      top: 0;
    }

    nav .igation ul li {
      margin: 16px 0;
      height: 18px;
    }

    nav .igation > li.flex-space { display: none }

    nav .igation > li.with-children > a { font-size: 20px }

    nav .igation ul li a {
      font-size: 16px;
      opacity: .6;
      padding-left: 0;
    }

    nav .igation > li:last-of-type { /* WALLET BUTTON */
      bottom: 0;
      margin: 0;
      opacity: 0;
      padding: 10px;
      position: absolute;
      transition: opacity 500ms ease-in;
      visibility: collapse;
      width: 100%;
    }

    nav.open .igation > li:last-of-type { /* WALLET BUTTON */
      opacity: 1;
      visibility: visible;
    }

    .bc-logo {
      float: left;
      left: 30px;
    }

    /* ANIMATED MENU BUTTON :) */

    .menu-button {
      appearance: none;
      background: none;
      border: none;
      display: block;
      float: right;
      height: 14px;
      margin: 3px 0 0 0;
      padding: 0;
      position: relative;
      transform: rotate(0deg); /* rotate compressed hamburger back to its origin (CCW) */
      transition: transform 500ms ease; /* duration -> 500ms (should be equal to duration of menu animation) */
      width: 22px;
    }

    .menu-button.is-active { /* rotate compressed hamburger 180° CW after 100ms */
      transform: rotate(180deg);
      transition-delay: 100ms;
    }

    .menu-button span {
      background: #fff;
      border-radius: 2px !important;
      display: block;
      height: 2px;
      left: 0px;
      position: absolute;
      right: 0px;
      top: 6px;
    }

    .menu-button span::before,
    .menu-button span::after {
      background-color: #fff;
      border-radius: 2px !important;
      content: "";
      display: block;
      height: 2px;
      left: 0;
      position: absolute;
      width: 100%;
    }

    .menu-button span::before { top: -6px }
    .menu-button span::after  { bottom: -6px }

    .menu-button span::before { transition-property: top, transform }
    .menu-button span::after  { transition-property: bottom, transform }

    .menu-button span::before,
    .menu-button span::after {
      transition-duration: 200ms, 250ms;
      transition-delay: 250ms, 0s; /* wait for origin rotation to complete before decompressing hamburger */
    }

    .menu-button.is-active span { background: none }

    .menu-button.is-active span::before {
      top: 0;
      transform: rotate(45deg);
    }

    .menu-button.is-active span::after {
      bottom: 0;
      transform: rotate(-45deg);
    }

    .menu-button.is-active span::before,
    .menu-button.is-active span::after {
      transition-delay: 0s, 250ms; /* delay before hamburger decompresses */
    }

    .search-button {
      background: none;
      border: none;
      display: block;
      float: right;
      height: 20px;
      margin-right: 25px;
      position: relative;
      width: 20px;

      &::after {
        color: #fff;
        font-family: 'icomoon';
        font-size: 17px;
        font-style: normal;
        font-variant: normal;
        font-weight: normal;
        left: 2px;
        position: absolute;
        speak: none;
        text-transform: none;
        top: 0px;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
    }

    .wallet-button {
      border-radius: 2px !important;
      display: block;
      font-size: 16px !important;
      height: 48px;
      padding-top: 17px !important;
    }

    .search-form {
      padding: 20px 10px 0 10px;
      width: 100%;
    }

    .search-bar, .search-bar:focus {
      background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 41.38 42.38'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%23979797;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3EAsset 2%3C/title%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='Layer_1-2' data-name='Layer 1'%3E%3Cg id='surface1'%3E%3Cpath className='cls-1' d='M19.18.13a17,17,0,1,0,6.92,31.21L36.25,41.5a3,3,0,0,0,4.25,0h0a3,3,0,0,0,0-4.25l-10-10a16.88,16.88,0,0,0,3.37-12.36A17,17,0,0,0,19.18.13ZM17,4A13,13,0,1,1,4,17,13,13,0,0,1,17,4Z'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E") no-repeat 12px center;
      background-size: 16px;
      border: none;
      border-radius: 20px;
      color: #454545;
      height: 40px;
      line-height: 14px;
      opacity: 0;
      padding: 0 10px 0 36px;
      width: inherit;

      &::placeholder {
        color: #979797;
        font-size: 14px;
        line-height: 18px;
      }

      &::-moz-placeholder {
        line-height: 40px;
      }

      &::-webkit-input-placeholder {
        color: #979797;
        font-size: 14px;
        line-height: 18px;
      }
    }

    nav.searching .search-bar {
      opacity: 1;
      transition: opacity 1s ease;
    }
  }

  /* DEVICE OPTIMIZATIONS */

  @media screen and (height: 480px) and (orientation: portrait) { /* iPhone 4s PORTRAIT */
    nav .igation > li.with-children {
      margin-top: 0;
      padding: 0 0 0 30px;
    }

    nav .igation > li.with-children > a,
    nav .igation ul li a { font-size: 14px }

    nav.open .igation > li:first-of-type { margin-bottom: 25px }

    nav .igation ul {
      left: 30px;
      padding-top: 30px;
    }
  }

  @media screen and (width: 480px) and (orientation: landscape) { /* iPhone 4s LANDSCAPE */
    nav .igation > li.with-children > a { font-size: 14px }
  }

  @media screen and (max-height: 667px) and (max-width: 1024px) and (orientation: landscape) { /* iPhone 4, 5, 6 LANDSCAPE */
    nav .igation > li.with-children {
      padding: 0 0 0 30px;
      width: 25%;
    }
    nav .igation ul {
      left: 30px;
      padding-top: 30px;
    }
  }

  @media screen and (max-height: 568px) and (max-width: 1024px) {
    nav .igation > li.with-children > a { font-size: 16px }
    nav .igation ul li { margin: 10px 0 }
  }

  @media screen and (height: 568px) and (orientation: portrait) { /* iPhone SE PORTRAIT */
    nav .igation > li.with-children { padding: 0 0 0 30px }
    nav .igation ul {
      left: 30px;
      padding-top: 30px;
    }
  }

  @media screen and (min-width: 667px) and (max-width: 1024px) { /* iPhone 7, 7+ LANDSCAPE, iPad PORTRAIT, iPad LANDSCAPE */
    nav .igation > li.with-children { width: 25% }
  }

  @media screen and (min-width: 768px) and (max-width: 1024px) {
    nav.open { height: 350px; }
  }
`

class Navigation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menuButtonIsActive: false,
      open: false,
      searching: false
    }
  }

  menuButtonPressed() {
    const { menuButtonIsActive, open } = this.state
    this.setState({
      menuButtonIsActive: !menuButtonIsActive,
      open: !open
    })
  }

  searchButtonPress() {
    const { searching } = this.state
    this.setState({
      open: false,
      searching: !searching
    })
  }

  setHeaderOpenState(state) {
    this.setState({
      open: state,
      menuButtonIsActive: state
    })
  }

  render() {
    const { menuButtonIsActive, open, searching } = this.state
    const status = open ? 'open' : searching ? 'searching' : null
    return (
      <Wrapper>
        <nav className={status}>
      		<ul className="igation">
      			<li className="">
      				<a className="bc-logo" href="https://blockchain.com">
      					<img src={Logo} alt="Blockchain" />
      				</a>
      				<button
                className={menuButtonIsActive ? 'menu-button is-active' : 'menu-button'}
                onClick={() => this.menuButtonPressed()}>
      					<span></span>
      				</button>
      				<button
                className="search-button"
                onClick={() => this.searchButtonPress()}
                type="button">
              </button>
      			</li>
      			<li
              className="with-children"
              onMouseEnter={() => this.setHeaderOpenState(true)}
              onMouseLeave={() => this.setHeaderOpenState(false)}>
      				<a href="https://blockchain.info/wallet" id="wallet-link">Wallet</a>
      				<ul>
      					<li><a href="https://blockchain.info/wallet/#/login">Login</a></li>
      				</ul>
      			</li>
      			<li
              className="with-children"
              onMouseEnter={() => this.setHeaderOpenState(true)}
              onMouseLeave={() => this.setHeaderOpenState(false)}>
      				<a href="https://blockchain.info">Data</a>
      				<ul>
      					<li><a href="https://blockchain.info/charts">Charts</a></li>
      					<li><a href="https://blockchain.info/stats">Stats</a></li>
      					<li><a href="https://blockchain.info/markets">Markets</a></li>
      				</ul>
      			</li>
      			<li
              className="with-children"
              onMouseEnter={() => this.setHeaderOpenState(true)}
              onMouseLeave={() => this.setHeaderOpenState(false)}>
      				<a href="https://blockchain.info/api">API</a>
      				<ul>
      					<li><a href="https://www.blockchain.com/enterprise">Business</a></li>
      				</ul>
      			</li>
      			<li
              className="with-children"
              onMouseEnter={() => this.setHeaderOpenState(true)}
              onMouseLeave={() => this.setHeaderOpenState(false)}>
      				<a href="https://www.blockchain.com/about">About</a>
      				<ul>
      					<li><a href="https://www.blockchain.com/team">Team</a></li>
      					<li><a href="https://www.blockchain.com/careers">Careers</a></li>
      					<li><a href="https://www.blockchain.com/press">Press</a></li>
      					<li><a href="https://blog.blockchain.com">Blog</a></li>
      				</ul>
      			</li>
      			<li className="flex-space"></li>
      			<li>
      				<form action="https://blockchain.info/search" className="search-form" method="GET">
      					<input className="search-bar" name="search" placeholder="block, hash, transaction, etc..." type="text" />
      				</form>
      			</li>
      			<li>
      				<a className="wallet-button" href="https://blockchain.info/wallet/#/signup">Get A Free Wallet</a>
      			</li>
      		</ul>
      	</nav>
      </Wrapper>
    )
  }
}

export default Navigation
