import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Icon } from '../Icons'

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.position === props.total ? props.theme['halftransparentgrey'] : 'transparent'};
  z-index: ${props => props.position ? (props.position) + 1040 : 1040};
`
const Container = styled.div`
  position: relative;
  width: calc(100% - ${props => props.position * 20}px);
  background-color: ${props => props.position === props.total ? props.theme['white'] : props.theme['gray-2']};
  z-index: ${props => props.position ? (props.position) + 1041 : 1041};

  @media(min-width: 768px) {
    width: ${props => props.size === 'small' ? 'calc(400px - ' + props.position * 20 + 'px)'
    : props.size === 'medium' ? 'calc(500 - ' + props.position * 20 + 'px)'
    : props.size === 'large' ? 'calc(600px - ' + props.position * 20 + 'px)'
    : 'calc(800px - ' + props.position * 20 + 'px)'};
  }
`
const Header = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 30px;
  border-bottom: 1px solid ${props => props.theme['gray-1']};
`
const HeaderIcon = styled(Icon)`
  display: inline-flex;
  font-size: 1.8em;
  font-weight: 300;
  margin-right: 10px;
`
const HeaderTitle = styled.span`
  font-size: 1.8em;
  font-weight: 300;
`
const ButtonClose = styled(Icon)`
  position: absolute;
  top: 30px;
  right: 20px;
  height: 20px;
  font-size: 20px;
  cursor: pointer;
`
const Content = styled.div`
  padding: 30px;
  box-sizing: border-box;
`

const Modal = ({ position, total, title, icon, size, closeButton, close, ...props }) => {
  return (
    <Wrapper position={position} total={total}>
      <Container position={position} total={total} size={size}>
        <Header>
          {icon && <HeaderIcon name={icon} />}
          {title && <HeaderTitle>{title}</HeaderTitle>}
          {closeButton && <ButtonClose name='close' onClick={() => close()} />}
        </Header>
        <Content>
          {props.children}
        </Content>
      </Container>
    </Wrapper>
  )
}

Modal.propTypes = {
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  title: PropTypes.string,
  icon: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large', '']),
  closeButton: PropTypes.bool,
  isLast: PropTypes.bool
}

Modal.defaultProps = {
  size: 'large',
  isLast: true,
  closeButton: true
}

export default Modal
