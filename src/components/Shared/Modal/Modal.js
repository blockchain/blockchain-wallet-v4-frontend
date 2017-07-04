import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Color from 'color'

const ModalWrapper = styled.div`
  display: ${props => props.visible ? 'flex' : 'none'};
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${props => Color(props.theme.black).fade(0.5).string()};
`

const ModalContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.white};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (min-width: 768px) {
    width: 600px;
    height: auto;
  }
`
const ModalHeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 30px;
`

const ModalButtonClose = styled.i`
  width: 30px;
  height: 30px;
  background-color: ${props => props.theme.black};
  cursor: pointer;
`

const ModalContentRow = styled.div`
  width: 100%;
  height: calc(100% - 30px);
`

const Modal = ({component: Component, ...props}) => {
  return (
    <ModalWrapper visible={props.displayed}>
      <ModalContainer>
        <ModalHeaderRow>
          <ModalButtonClose onClick={props.close} />
        </ModalHeaderRow>
        <ModalContentRow>
          <Component {...props} />
        </ModalContentRow>
      </ModalContainer>
    </ModalWrapper>
  )
}

Modal.propTypes = {
  displayed: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired
}

Modal.defaultProps = {
  displayed: false,
  component: () => <div />
}

export default Modal
