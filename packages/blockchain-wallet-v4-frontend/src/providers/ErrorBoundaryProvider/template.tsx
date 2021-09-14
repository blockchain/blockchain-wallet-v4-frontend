import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import {
  Button,
  Icon,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text,
  TextGroup
} from 'blockchain-info-components'
import { media } from 'services/styles'

const TitleGroup = styled(TextGroup)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const ErrorDetails = styled.div`
  margin-top: 8px;
  white-space: pre-line;
  max-height: 350px;
  overflow: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  ${media.tablet`
    max-height: 200px;
  `}
  > summary {
    &:hover {
      cursor: pointer;
    }
  }
`

const ErrorBoundary = (props: { error: TypeError; onSubmit: any }) => {
  const { error, onSubmit } = props

  return (
    <Modal size='large' style={{ zIndex: 999 }}>
      <ModalHeader closeButton={false}>
        <TitleGroup inline>
          <Icon name='alert-filled' size='28px' color='blue900' />
          <Text weight={400} size='22px' color='blue900' style={{ paddingLeft: '8px' }}>
            <FormattedMessage
              id='modal.errorboundary.title'
              defaultMessage="Oops! Something's not right here"
            />
          </Text>
        </TitleGroup>
      </ModalHeader>
      <ModalBody>
        <TextGroup>
          <Text weight={400} size='14px' color='grey700'>
            <FormattedMessage
              id='modal.errorboundary.message'
              defaultMessage="We're sorry, but it seems like something is not quite right. Please try again or contact support if the problem persists."
            />
          </Text>
        </TextGroup>
        <Text weight={600} size='16px' color='red600'>
          Error Details:
        </Text>
        <Text weight={400} size='14px'>
          <ErrorDetails>{error && error.stack}</ErrorDetails>
        </Text>
      </ModalBody>
      <ModalFooter align='right'>
        <Button
          type='submit'
          nature='primary'
          onClick={onSubmit}
          data-e2e='oopsErrorContinueButton'
        >
          <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default ErrorBoundary
