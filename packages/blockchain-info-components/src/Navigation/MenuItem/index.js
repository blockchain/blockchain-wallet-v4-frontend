import React, { Component } from 'react'
import styled from 'styled-components'

const Item = styled.li`
  &:nth-of-type(1) {
    order: 1;
  } /* BLOCKCHAIN LOGO */
  &:nth-of-type(2) {
    order: 2;
  } /* WALLET */
  &:nth-of-type(3) {
    order: 3;
  } /* DATA */
  &:nth-of-type(4) {
    order: 4;
  } /* API */
  &:nth-of-type(5) {
    order: 5;
  } /* ABOUT */
  &:nth-of-type(6) {
    order: 6;
  } /* FLEXIBLE SPACE */
  &:nth-of-type(7) {
    order: 7;
  } /* SEARCH BAR */
  &:nth-of-type(8) {
    order: 8;
  } /* GET FREE WALLET BUTTON */

  @media screen and (max-width: 1024px) {
    &:nth-of-type(1) {
      order: 1;
    } /* BLOCKCHAIN LOGO */
    &:nth-of-type(2) {
      order: 3;
    } /* WALLET */
    &:nth-of-type(3) {
      order: 4;
    } /* DATA */
    &:nth-of-type(4) {
      order: 5;
    } /* API */
    &:nth-of-type(5) {
      order: 6;
    } /* ABOUT */
    &:nth-of-type(6) {
      order: 7;
    } /* FLEXIBLE SPACE */
    &:nth-of-type(7) {
      order: 2;
    } /* SEARCH BAR */
    &:nth-of-type(8) {
      order: 8;
    } /* GET FREE WALLET BUTTON */
  }

  &:first-of-type {
    /* BLOCKCHAIN LOGO */
    margin-right: 30px;
    opacity: 1 !important;
  }

  &:last-of-type {
    /* GET FREE WALLET BUTTON */
    margin-left: 25px;
    @media screen and (max-width: 1024px) {
      bottom: 0;
      margin: 0;
      opacity: 0;
      padding: 10px;
      position: absolute;
      transition: opacity 500ms ease-in;
      visibility: collapse;
      width: 100%;
    }
  }

  & > a,
  & > a:hover,
  & > a:visited {
    color: ${props => props.theme.white};
    position: relative;
    text-decoration: none;
    text-transform: uppercase;
    z-index: 1;
  }

  &.with-children {
    border-radius: 2px 2px 0 0 !important;
    padding: 0 40px 0 20px;
    position: relative;
    @media screen and (height: 480px) and (orientation: portrait) {
      margin-top: 0;
      padding: 0 0 0 30px;
    }
    @media screen and (max-height: 667px) and (max-width: 1024px) and (orientation: landscape) {
      padding: 0 0 0 30px;
      width: 25%;
    }
    @media screen and (height: 568px) and (orientation: portrait) {
      padding: 0 0 0 30px;
    }
    @media screen and (min-width: 667px) and (max-width: 1024px) {
      width: 25%;
    }
    @media screen and (min-width: 1024px) and (max-width: 1155px) {
      padding-right: 20px;
    }
    @media screen and (max-width: 1024px) {
      margin: 0;
      min-height: 170px;
      opacity: 0;
      padding-left: 40px;
      width: 50%;
    }
  }

  &.with-children:hover ul {
    background: rgba(255, 255, 255, 0.08);
    list-style: none;
    transition: background 0.4s ease-in;
  }

  &.with-children > a {
    font-size: 13px;
    @media screen and (height: 480px) and (orientation: portrait) {
      font-size: 14px;
    }
    @media screen and (width: 480px) and (orientation: landscape) {
      font-size: 14px;
    }
    @media screen and (max-height: 568px) and (max-width: 1024px) {
      font-size: 16px;
    }
  }

  &.with-children:hover ul li {
    height: 18px;
    transition: height 0.25s ease-in;
    @media screen and (max-height: 568px) and (max-width: 1024px) {
      margin: 10px 0;
    }
  }

  &.with-children:hover ul li a {
    opacity: 0.6;
    transition: opacity 0.2s ease-in;
    transition-delay: 0.1s;
    @media screen and (height: 480px) and (orientation: portrait) {
      font-size: 14px;
    }
  }

  & ul {
    background: rgba(255, 255, 255, 0);
    height: 150px;
    left: 0;
    list-style: none;
    padding: 0;
    position: absolute;
    top: -10px;
    min-width: 90px;
    padding-top: 40px;
    & li {
      margin: 6px 0;
      height: 0;
      transition: height 0.25s ease-out;
      &:first-of-type {
        margin-top: 0;
      }
      &:hover {
        & a,
        & a:active,
        & a:visited {
          text-decoration: none;
        }
        & a:focus {
          outline: none !important;
        }
        & a {
          opacity: 1 !important;
          transition: opacity 0.2s ease-in;
        }
      }
      & a {
        color: ${props => props.theme.white};
        display: block;
        font-size: 12px;
        font-weight: 400;
        opacity: 0;
        padding-left: 20px;
      }
    }
    @media screen and (height: 480px) and (orientation: portrait) {
      left: 30px;
      padding-top: 30px;
    }
    @media screen and (max-height: 667px) and (max-width: 1024px) and (orientation: landscape) {
      left: 30px;
      padding-top: 30px;
    }
    @media screen and (height: 568px) and (orientation: portrait) {
      left: 30px;
      padding-top: 30px;
    }
  }
`

class MenuItem extends Component {
  render() {
    const { children, flexibleSpace, hasMenu, onChange } = this.props
    return flexibleSpace ? (
      <Item style={{ flexGrow: 1 }} />
    ) : (
      <Item
        className={hasMenu ? 'with-children' : null}
        onMouseEnter={hasMenu ? () => onChange(true) : null}
        onMouseLeave={hasMenu ? () => onChange(false) : null}
      >
        {' '}
        {children}{' '}
      </Item>
    )
  }
}

export default MenuItem
