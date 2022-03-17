import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Image, Modal } from 'blockchain-info-components'

import {
  Description,
  StyledButton,
  StyledModalBody,
  StyledModalFooter,
  StyledModalHeader,
  Title
} from './model'

const ErrorMessage = () => (
  <>
    <Title size='24px' weight={600} color='black'>
      <FormattedMessage
        id='modal.generate.report.error.title'
        defaultMessage='Your Report can not be generated!'
      />
    </Title>
    <Description size='14px'>
      <FormattedMessage
        id='modal.generate.report.error.description'
        defaultMessage='Please try again in a few minutes!'
      />
    </Description>
  </>
)

const SuccessMessage = () => (
  <>
    <Title size='24px' weight={600} color='black'>
      <FormattedMessage
        id='modal.generate.report.title'
        defaultMessage='our Report Is Being Generated!'
      />
    </Title>
    <Description size='14px'>
      <FormattedMessage
        id='modal.generate.report.description'
        defaultMessage='This process can take up to 60 minutes. We will notify you via email when the report is ready.'
      />
    </Description>
  </>
)

const GeneratReport = ({ onClose, report }) => (
  <Modal size='medium'>
    <StyledModalHeader onClose={onClose} />
    <StyledModalBody>
      <Image name='subtract-check-circle' width='88px' height='88px' />
      {report.cata({
        Failure: () => <ErrorMessage />,
        Loading: () => <></>,
        NotAsked: () => <ErrorMessage />,
        Success: () => <SuccessMessage />
      })}
    </StyledModalBody>
    <StyledModalFooter align='center'>
      <StyledButton
        data-e2e='generateReportButton'
        type='submit'
        nature='primary'
        capitalize
        onClick={onClose}
      >
        <FormattedMessage id='buttons.ok' defaultMessage='OK' />
      </StyledButton>
    </StyledModalFooter>
  </Modal>
)

export default GeneratReport
