import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Icon } from 'components/generic/Icon'

const Wrapper = styled.div`
  display: ${props => props.show ? 'flex' : 'none'};
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: fixed;
  overflow-y: auto;
  overflow-x: hidden;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5);
`
const Container = styled.div`
  width: ${props => props.size === 'small' ? '400px'
    : props.size === 'medium' ? '500px'
    : props.size === 'large' ? '600px' : '800px'};
  padding: 40px;
  background-color: #FFFFFF;
`
const Header = styled.div`
  diplay: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
const Title = styled.div``
const ButtonClose = styled(Icon)`
  font-size: 20px;
`
const Content = styled.div`

`

const Modal = ({ ...props, children }) => {
  const { show, title: Component, close, closeCallback } = props
  return (
    <Wrapper show={show}>
      <Container>
        <Header>
          <Title>
            <Component />
          </Title>
          { close && <ButtonClose name='ti-close' onClick={() => closeCallback()} /> }
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
  title: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large', '']),
  close: PropTypes.bool

}

Modal.defaultProps = {
  show: false,
  size: 'large',
  close: true
}

export default Modal
