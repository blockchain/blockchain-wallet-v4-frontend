import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Icon } from 'components/generic/Icon'

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
  z-index: 1040;
  background-color: ${props => props.darken ? 'rgba(0,0,0,0.5)' : 'transparent'};
`

const Container = styled.div`
  position: relative;
  width: 100%;
  background-color: #FFFFFF;
  z-index: ${props => props.position ? (props.position) + 1040 : 1040};
  @media(min-width: 768px) {
    width: ${props => props.size === 'small' ? '400px'
    : props.size === 'medium' ? '500px'
      : props.size === 'large' ? '600px' : '800px'};
  }
`
const Header = styled.div`
  position: relative;
  diplay: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 30px;
  border-bottom: 1px solid #EFEFEF;
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

const Modal = ({ position, title, icon, size, closeButton, close, ...props }) => (
  <Wrapper darken={position === 0}>
    <Container position={position} size={size}>
      <Header>
        {icon && <HeaderIcon name={icon} />}
        {title && <HeaderTitle>{title}</HeaderTitle>}
        {closeButton && <ButtonClose name='ti-close' onClick={() => close()} />}
      </Header>
      <Content>
        {props.children}
      </Content>
    </Container>
  </Wrapper>
)

Modal.propTypes = {
  position: PropTypes.number.isRequired,
  title: PropTypes.string,
  icon: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large', '']),
  closeButton: PropTypes.bool
}

Modal.defaultProps = {
  size: 'large',
  closeButton: true
}

export default Modal
