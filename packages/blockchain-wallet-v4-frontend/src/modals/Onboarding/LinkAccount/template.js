import React from 'react'
import styled from 'styled-components'
import { Modal, ModalBody } from 'blockchain-info-components'

const ModalBodyStyled = styled(ModalBody)`
  background: ${props =>
    `linear-gradient(321.54deg, ${props.theme.purple} -15.42%, ${
      props.theme.black
    } 54.12%)`};
`

const LinkAccount = props => {
  return (
    <Modal size='medium'>
      <ModalBodyStyled>
        <div>Linking Your Account</div>
        <div>Current Status: {props.status}</div>
      </ModalBodyStyled>
    </Modal>
  )
}

export default LinkAccount
