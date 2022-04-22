import React from 'react'
import { FormattedMessage } from 'react-intl'
import { compose } from 'ramda'
import styled from 'styled-components'

import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'blockchain-info-components'
import { ModalName } from 'data/modals/types'
import modalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../types'

const Cancel = styled.span`
  margin-right: 20px;
  font-size: 14px;
  cursor: pointer;
`

const Wrapper = styled.div`
  font-weight: 400;
  color: ${(props) => props.theme.grey700};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`

type MainProps = {
  body: JSX.Element
  header?: JSX.Element
  hideCancel?: boolean
  onConfirm?: () => void
  onDismiss?: () => void
}

type Props = MainProps & ModalPropsType

const CustomizableConfirm = ({ body, close, header, hideCancel, onConfirm, onDismiss }: Props) => {
  const handleOnConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    close()
  }

  const handleOnDismiss = () => {
    if (onDismiss) {
      onDismiss()
    }
    close()
  }

  return (
    <Modal size='small'>
      <ModalHeader onClose={handleOnDismiss}>{header}</ModalHeader>
      <Wrapper>
        <ModalBody>{body}</ModalBody>
        <ModalFooter align='right'>
          {!hideCancel && (
            <Cancel data-e2e='cancelCustomizableConfirmModalLink' onClick={handleOnDismiss}>
              <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
            </Cancel>
          )}
          <Button
            nature='primary'
            capitalize
            data-e2e='customizableConfirmModalSubmitButton'
            onClick={handleOnConfirm}
          >
            <FormattedMessage id='modals.confirm.button' defaultMessage='OK' />
          </Button>
        </ModalFooter>
      </Wrapper>
    </Modal>
  )
}

const enhance = compose(modalEnhancer(ModalName.CUSTOMIZABLE_CONFIRM_MODAL))

export default enhance(CustomizableConfirm)
