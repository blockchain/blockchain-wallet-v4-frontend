import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { reduxForm } from 'redux-form'

import { Button, Icon, Modal, ModalHeader, ModalBody, ModalFooter, TextGroup, Text } from 'blockchain-info-components'
import { Form } from 'components/Form'

const TitleGroup = styled(TextGroup)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const ErrorDetails = styled.details`
  margin-top: 20px;
  white-space: pre-wrap;
  max-height: 350px;
  overflow: scroll;
  @media (max-width: 768px) {
    max-height: 200px;
  }
  > summary {
    &:hover { cursor: pointer; }
  }
`

const ErrorBoundary = (props) => {
  const { error, errorInfo, handleSubmit } = props

  return (
    <Modal size='large'>
      <Form onSubmit={handleSubmit}>
        <ModalHeader closeButton={false}>
          <TitleGroup inline>
            <Icon name='alert-filled' size='28px' color='brand-primary' />
            <Text weight={300} size={'22px'} color='brand-primary' style={{ paddingLeft: '8px' }}>
              <FormattedMessage id='modal.errorboundary.title' defaultMessage="Oops! Something's not right here" />
            </Text>
          </TitleGroup>
        </ModalHeader>
        <ModalBody>
          <TextGroup>
            <Text weight={300} size={'14px'} color='gray-5'>
              <FormattedMessage id='modal.errorboundary.message' defaultMessage="We're sorry, but it seems like something is not quite right. Please try again or contact support if the problem persists." />
            </Text>
          </TextGroup>
          <Text weight={300} size={'14px'}>
            <ErrorDetails>
              <summary>Error Details</summary>
              {error && error.toString()}
              <br />
              {errorInfo.componentStack}
            </ErrorDetails>
          </Text>
        </ModalBody>
        <ModalFooter align='right'>
          <Button type='submit' nature='primary'>
            <FormattedMessage id='modal.errorboundary.continue' defaultMessage='Continue' />
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

export default reduxForm({ form: 'errorBoundary' })(ErrorBoundary)
