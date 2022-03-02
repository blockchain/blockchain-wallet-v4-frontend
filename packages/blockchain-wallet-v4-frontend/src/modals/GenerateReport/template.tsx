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

const GeneratReport = ({ onClose }) => (
  <Modal size='medium'>
    <StyledModalHeader onClose={onClose} />
    <StyledModalBody>
      <Image name='subtract-check-circle' width='88px' height='88px' />
      <Title size='24px' weight={600} color='black'>
        <FormattedMessage
          id='modal.generate.report.title'
          defaultMessage='Your Report Is Being Generated!'
        />
      </Title>
      <Description size='14px'>
        <FormattedMessage
          id='modal.generate.report.description'
          defaultMessage='This process can take up to 60 minutes. We will notify you via email when the report is
          ready.'
        />
      </Description>
    </StyledModalBody>
    <StyledModalFooter align='center'>
      <StyledButton
        data-e2e='generateReportButton'
        type='submit'
        nature='primary'
        capitalize
        onClick={onClose}
      >
        <FormattedMessage id='modals.generate.report.button' defaultMessage='OK' />
      </StyledButton>
    </StyledModalFooter>
  </Modal>
)

export default GeneratReport
