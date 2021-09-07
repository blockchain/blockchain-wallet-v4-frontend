import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { Form } from 'components/Form'
import { model } from 'data'
import { InterestUploadDocumentFormValueTypes } from 'data/types'

import DragAndDrop from '../../DragAndDrop'
import Container from '../Container'
import Content from '../Content'
import Footer from '../Footer'
import Header from '../Header'

const { INTEREST_UPLOAD_DOCUMENT } = model.components.interestUploadDocument

const Title = styled(Text)`
  color: ${(props) => props.theme.grey900};
  font-size: 16px;
  font-weight: 600;
  line-height: 150%;
`

const Subtitle = styled(Text)`
  color: ${(props) => props.theme.grey900};
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
`

export const ContentDivider = styled.div`
  height: 20px;
  border-bottom: 1px solid ${(props) => props.theme.grey000};
  margin: 40px 0 0 0;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px 40px 0 40px;
`

const DragAndDropContainer = styled.div`
  margin-top: 16px;
`

const DragAndDropContainerSecond = styled(DragAndDropContainer)`
  margin-top: 40px;
`

const UploadAndVerify: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => {
  const [proofOfAddress1, setProofOfAddress1] = useState(false)
  const [proofOfAddress2, setProofOfAddress2] = useState(false)
  const [sourceOfWelth1, setSourceOfWelth1] = useState(false)
  const [sourceOfWelth2, setSourceOfWelth2] = useState(false)

  const handleDrop = (files) => {
    // console.log('files', files)
    // console.log('files length', files.length)
    for (let i = 0; i < files.length; i += 1) {
      if (!files[i].name) return
      // fileList.push(files[i].name)
      // console.log('files', files)
    }
    setProofOfAddress1(true)
  }
  const handleDropAlternative = (files) => {
    // console.log('files', files)
    // console.log('files length', files.length)
    for (let i = 0; i < files.length; i += 1) {
      if (!files[i].name) return
      // fileList.push(files[i].name)
      // console.log('files', files)
    }
    setProofOfAddress2(true)
  }

  const fileDownload = () => {
    // console.log('download')
  }
  const fileDelete = () => {
    // console.log('delete')
  }

  const disabled = true
  return (
    <Container>
      <Form onSubmit={props.handleSubmit}>
        <Header
          data-e2e='InterestUploadAndVerifiedNextStep'
          mode='back'
          onClick={props.previousStep}
        >
          <FormattedMessage
            id='modals.interest.withdrawal.upload_documents.get_started.title'
            defaultMessage='Upload & Verify'
          />
        </Header>
        <Content mode='top'>
          <ContentWrapper>
            <Title>
              <FormattedMessage
                id='modals.interest.withdrawal.upload_documents.get_started.proof_of_current_address'
                defaultMessage='Proof of Current Address'
              />
            </Title>
            <Subtitle color='grey900' size='14px' weight={500} lineHeight='20px'>
              <FormattedMessage
                id='modals.interest.withdrawal.upload_documents.get_started.bank_acccount_statement'
                defaultMessage='Bank Account Statement or Utility Bill'
              />
            </Subtitle>

            <Text color='grey600' lineHeight='1.5' size='12px' weight={500}>
              <FormattedMessage
                id='modals.interest.withdrawal.upload_documents.get_started.bank_acccount_statement.description'
                defaultMessage='Must be dated within the last 90 days or a council tax bill for the current tax year.'
              />
            </Text>

            <DragAndDropContainer>
              <DragAndDrop
                handleDrop={handleDrop}
                no='1'
                fileUploaded={proofOfAddress1}
                isProofOfAddress
                onFileDelete={() => fileDelete()}
                onFileDownload={() => fileDownload()}
              />
            </DragAndDropContainer>
            {proofOfAddress1 && (
              <DragAndDropContainerSecond>
                <DragAndDrop
                  handleDrop={handleDropAlternative}
                  no='2'
                  fileUploaded={proofOfAddress2}
                  isOptional
                  isProofOfAddress
                  onFileDelete={() => fileDelete()}
                  onFileDownload={() => fileDownload()}
                />
              </DragAndDropContainerSecond>
            )}
          </ContentWrapper>
          <ContentDivider />
          <ContentWrapper>
            <Title>
              <FormattedMessage
                id='modals.interest.withdrawal.upload_documents.get_started.source_of_wealth.source_of_wealth'
                defaultMessage='Source of Wealth'
              />
            </Title>
            <Subtitle color='grey900' size='14px' weight={500} lineHeight='20px'>
              <FormattedMessage
                id='modals.interest.withdrawal.upload_documents.get_started.source_of_wealth.bank_account_stub'
                defaultMessage='Bank Account Statement or Pay Stub/Slip.'
              />
            </Subtitle>

            <DragAndDropContainer>
              <DragAndDrop
                handleDrop={handleDrop}
                no='1'
                fileUploaded={sourceOfWelth1}
                onFileDelete={() => fileDelete()}
                onFileDownload={() => fileDownload()}
              />
            </DragAndDropContainer>
            {sourceOfWelth1 && (
              <DragAndDropContainerSecond>
                <DragAndDrop
                  handleDrop={handleDrop}
                  no='2'
                  fileUploaded={sourceOfWelth2}
                  isOptional
                  onFileDelete={() => fileDelete()}
                  onFileDownload={() => fileDownload()}
                />
              </DragAndDropContainerSecond>
            )}
          </ContentWrapper>
        </Content>
      </Form>
      <Footer>
        <Button
          nature='primary'
          data-e2e='additionalInfoUploadDocument'
          type='button'
          fullwidth
          height='48px'
          style={{ marginTop: '16px' }}
          onClick={props.nextStep}
          disabled={disabled}
        >
          <FormattedMessage id='buttons.submit' defaultMessage='Submit' />
        </Button>
      </Footer>
    </Container>
  )
}

export type Props = {
  formValues: InterestUploadDocumentFormValueTypes
  handleSubmit: () => void
  nextStep: () => void
  previousStep: () => void
}

export default reduxForm<{}, Props>({
  destroyOnUnmount: false,
  form: INTEREST_UPLOAD_DOCUMENT
})(UploadAndVerify)
