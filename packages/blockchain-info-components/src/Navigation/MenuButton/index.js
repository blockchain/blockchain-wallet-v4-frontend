
import React from 'react'
import styled from 'styled-components'

const Button = styled.button`
  display: none;
  @media screen and (max-width: 1024px) {
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
    &.is-active { /* rotate compressed hamburger 180° CW after 100ms */
      transform: rotate(180deg);
      transition-delay: 100ms;
    }
    & span {
      background: ${props => props.theme['white']};
      border-radius: 2px !important;
      display: block;
      height: 2px;
      left: 0px;
      position: absolute;
      right: 0px;
      top: 6px;
    }
    & span::before,
    & span::after {
      background-color: ${props => props.theme['white']};
      border-radius: 2px !important;
      content: "";
      display: block;
      height: 2px;
      left: 0;
      position: absolute;
      width: 100%;
    }

    & span::before { top: -6px }
    & span::after  { bottom: -6px }

    & span::before { transition-property: top, transform }
    & span::after  { transition-property: bottom, transform }

    & span::before,
    & span::after {
      transition-duration: 200ms, 250ms;
      transition-delay: 250ms, 0s; /* wait for origin rotation to complete before decompressing hamburger */
    }

    &.is-active span { background: none }

    &.is-active span::before {
      top: 0;
      transform: rotate(45deg);
    }

    &.is-active span::after {
      bottom: 0;
      transform: rotate(-45deg);
    }

    &.is-active span::before,
    &.is-active span::after {
      transition-delay: 0s, 250ms; /* delay before hamburger decompresses */
    }
  }
`

const MenuButton = props => {
  return (
    <Button />
  )
}

export default MenuButton
