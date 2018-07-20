import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { transparentize, darken } from 'polished'

import { Icon } from '../Icons'

const Wrapper = styled.div`
  height: 65px;
  width: 100%;
  background-color: ${props => props.theme['white']};

  @media (min-width: 768px) {
    width: 500px;
  }
`
const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 15px 10px 15px 25px;
  box-sizing: border-box;
  background: ${props => transparentize(0.9, props.theme[props.color])};
  color: ${props => props.theme[props.color]};
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 400;
  border-top: 6px solid
    ${props => transparentize(0.8, props.theme[props.color])};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
`
const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex: 100%;
  margin-right: 10px;
  box-sizing: border-box;

  & > :first-child {
    text-transform: uppercase;
  }

  @media (min-width: 768px) {
    & > :first-child {
      display: none;
    }
  }
`
const Close = styled(Icon)`
  &:hover {
    color: ${props => darken(0.2, props.theme[props.color])}!important;
  }
`

const selectColor = type => {
  switch (type) {
    case 'success':
      return 'success'
    case 'error':
      return 'error'
    case 'info':
      return 'brand-secondary'
    default:
      return 'brand-secondary'
  }
}

const Toast = props => {
  const { nature, onClose, children } = props
  const color = selectColor(nature)

  return (
    <Wrapper>
      <Container color={color}>
        <Content>{children}</Content>
        <Close
          name='close'
          size='20px'
          weight={300}
          color={color}
          cursor
          onClick={onClose}
        />
      </Container>
    </Wrapper>
  )
}

Toast.propTypes = {
  nature: PropTypes.oneOf(['success', 'error', 'info']),
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
}

Toast.defaultProps = {
  nature: 'info'
}

export default Toast
