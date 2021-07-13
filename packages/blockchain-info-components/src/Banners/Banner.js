import React from 'react'
import { transparentize } from 'polished'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Icon } from '../Icons'
import { Text } from '../Text'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: ${(props) => transparentize(0.9, props.theme[props.color])};
  border: 1px solid ${(props) => transparentize(0.8, props.theme[props.color])};
  border-radius: 4px;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  width: ${(props) => (props.width ? props.width : `initial`)};
  margin-left: ${(props) => (props.inline && !props.label ? '5px' : '0px')};
  padding: ${(props) => (props.inline || props.label ? '3px 5px' : '5px 10px')};
  & > span:first-child {
    margin-right: ${(props) => (props.inline ? '3px' : '10px')};
  }
`

const BannerContent = styled(Text)`
  display: flex;
  flex-direction: row;
  white-space: ${(props) => (props.inline ? 'nowrap' : 'initial')};
  & a:last-of-type {
    margin-left: 5px;
  }
`

const selectStyle = (type) => {
  switch (type) {
    case 'success':
      return {
        color: 'success',
        icon: 'checkmark-in-circle',
        uppercase: false
      }
    case 'warning':
      return { color: 'error', icon: 'alert-filled', uppercase: true }
    case 'alert':
      return { color: 'blue600', icon: 'bell', uppercase: false }
    case 'caution':
      return { color: 'brand-yellow', icon: 'alert-filled', uppercase: false }
    case 'white':
      return { color: 'white', icon: null, uppercase: true }
    case 'informational':
      return { color: 'grey700', icon: null, uppercase: false }
    default:
      return { color: 'blue600', icon: null, uppercase: false }
  }
}

const Banner = (props) => {
  const { children, inline, label, size, style: customCss, type, width } = props
  const style = selectStyle(type)
  const { color, icon, uppercase } = style

  return (
    <Container
      className={props.className}
      color={color}
      width={width}
      inline={inline}
      label={label}
      data-e2e={props['data-e2e']}
      style={customCss}
    >
      {icon && <Icon name={icon} size='18px' weight={400} color={color} />}
      <BannerContent
        size={size || '12px'}
        weight={500}
        color={color}
        uppercase={uppercase}
        inline={inline}
      >
        {children}
      </BannerContent>
    </Container>
  )
}

Banner.propTypes = {
  children: PropTypes.node.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object,
  type: PropTypes.oneOf(['success', 'warning', 'alert', 'caution', 'informational']),
  width: PropTypes.string
}

export default Banner
