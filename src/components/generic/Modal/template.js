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
  display: ${props => props.show ? 'flex' : 'none'};
  flex-direction: row;
  justify-content: center;
  align-items: center;
  z-index: 1040;
  background-color: rgba(0,0,0,0.5);
`
const Container = styled.div`
  position: relative;
  width: 100%;
  padding: 40px;
  background-color: #FFFFFF;

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
  height: 40px;
  width: 100%;
  border-bottom: 1px solid #EFEFEF;
`
const HeaderIcon = styled(Icon)`
  display: inline-flex;
  font-size: 1.8em;
  font-weight: 300;
  margin-right: 10px;
`
const HeaderTitle = styled.span`
  display: inline-flex;
  font-size: 1.8em;
  font-weight: 300;
`
const ButtonClose = styled(Icon)`
  position: absolute;
  font-size: 20px;
  cursor: pointer;
  right: 0;
  top: 0;
`
const Content = styled.div`
  padding: 10px 0;
`

const Modal = ({ ...props, children }) => {
  const { title, icon, show, size, closeButton, close } = props
  return (
    <Wrapper show={show}>
      <Container size={size}>
        <Header>
          { icon && <HeaderIcon name={icon} /> }
          { title && <HeaderTitle>{title}</HeaderTitle> }
          { closeButton && <ButtonClose name='ti-close' onClick={() => close()} /> }
        </Header>
        <Content>
          {children}
        </Content>
      </Container>
    </Wrapper>
  )
}

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string,
  icon: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large', '']),
  closeButton: PropTypes.bool

}

Modal.defaultProps = {
  show: false,
  size: 'large',
  closeButton: true
}

export default Modal
