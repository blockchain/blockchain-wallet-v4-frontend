import React from 'react'
import styled from 'styled-components'

import { Color } from '../../Colors/index.ts'
import { trackButtonEvent } from '../Events'
import Link from '../Link'

const DefaultButton = styled('button', 'input[type=submit]')`
  display: inline-block;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
  flex: 0 0 auto;
  border-radius: ${props =>
    props.big ? 'var(--lgBorderRadius)' : 'var(--smBorderRadius)'};
  height: ${props => (props.big ? '3.5rem' : '2.5rem')};
  font-size: ${props => (props.big ? '1.25rem' : '1rem')};
  padding: ${props => (props.big ? '0 2rem' : '0 1rem')};
  color: ${props => (props.textColor ? props.textColor : 'white')};
  border: ${props =>
    props.outline
      ? props.bgColor
        ? '2px solid ' + props.bgColor
        : `2px solid ${Color('blue600')}`
      : 'transparent'};
  background-color: ${props =>
    props.outline
      ? 'transparent'
      : props.bgColor
      ? props.bgColor
      : Color('blue600')};
  line-height: ${props => (props.outline ? '2rem' : '2.5rem')};
  &:hover {
    transform: scale(0.95);
    transition: all 0.3s ease;
  }
  a {
    color: inherit;
  }
`

const handleClick = props => {
  return () => {
    if (props.onClick) {
      props.onClick()
    }
    if (props.event) {
      trackButtonEvent(props.event)
    }
  }
}

const SecondaryButton = styled(DefaultButton)`
  background-color: rgba(1, 1, 1, 0.1);
  color: white;
`

const Button = props => {
  let { download, href, rel, target } = props
  if (href) {
    return (
      <Link
        href={href}
        target={target}
        download={download}
        rel={rel}
        onClick={handleClick(props)}
      >
        <DefaultButton
          big={props.big}
          bgColor={props.bgColor}
          outline={props.outline}
          textColor={props.textColor}
        >
          {props.children}
        </DefaultButton>
      </Link>
    )
  }
  return props.secondary ? (
    <SecondaryButton onClick={handleClick(props)}>
      {props.children}
    </SecondaryButton>
  ) : (
    <DefaultButton
      big={props.big}
      bgColor={props.bgColor}
      outline={props.outline}
      textColor={props.textColor}
      type={props.type}
      value={props.value}
      onClick={handleClick(props)}
    >
      {props.children}
    </DefaultButton>
  )
}

export default Button
