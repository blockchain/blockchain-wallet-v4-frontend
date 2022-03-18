import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Remote } from '@core'
import { Image, Modal } from 'blockchain-info-components'

import {
  Description,
  StyledButton,
  StyledModalBody,
  StyledModalFooter,
  StyledModalHeader,
  Title
} from './model'

const LoadingState = () => (
  <>
    <Image name='subtract-check-circle' width='88px' height='88px' />
    <Title size='24px' weight={600} color='black'>
      <FormattedMessage
        id='modal.generate.report.processing.title'
        defaultMessage='Sending request to generate report'
      />
    </Title>
    <Description size='14px'>
      <FormattedMessage
        id='modal.generate.report.processing.description'
        defaultMessage='Please wait...'
      />
    </Description>
  </>
)

const GenerateReport = ({ onClose, reportGenerationStatus }) => (
  <Modal size='medium'>
    <StyledModalHeader onClose={() => onClose()} />
    <StyledModalBody>
      {reportGenerationStatus.cata({
        Failure: () => (
          <>
            <Image name='email-error' width='128px' height='128px' />
            <Title size='24px' weight={600} color='black'>
              <FormattedMessage
                id='modal.generate.report.error.title'
                defaultMessage='Your report can not be generated!'
              />
            </Title>
            <Description size='14px'>
              <FormattedMessage
                id='modal.generate.report.error.description'
                defaultMessage='Please try again in a few minutes!'
              />
            </Description>
          </>
        ),
        Loading: () => <LoadingState />,
        NotAsked: () => <LoadingState />,
        Success: () => (
          <>
            <Image name='email-success' width='128px' height='128px' />
            <Title size='24px' weight={600} color='black'>
              <FormattedMessage
                id='modal.generate.report.title'
                defaultMessage='Your Report Is Being Generated!'
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
      })}
    </StyledModalBody>
    <StyledModalFooter align='center'>
      <StyledButton
        data-e2e='closeReportGenerationModalButton'
        disabled={Remote.Loading.is(reportGenerationStatus)}
        type='submit'
        nature='primary'
        capitalize
        onClick={() => onClose()}
      >
        <FormattedMessage id='buttons.ok' defaultMessage='OK' />
      </StyledButton>
    </StyledModalFooter>
  </Modal>
)

export default GenerateReport
