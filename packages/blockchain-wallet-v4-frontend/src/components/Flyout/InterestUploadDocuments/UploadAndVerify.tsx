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
  margin-bottom: 40px;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px 40px 0 40px;
  margin-bottom: 16px;
`

const DragAndDropContainer = styled.div`
  margin: 16px 0 40px 0;
`

const UploadAndVerify: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => {
  const [proofOfAddress1, setProofOfAddress1] = useState(false)
  const [proofOfAddress2, setProofOfAddress2] = useState(false)
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
              <DragAndDrop handleDrop={handleDrop} no='1' fileUploaded={proofOfAddress1} />
            </DragAndDropContainer>
            {proofOfAddress1 && (
              <DragAndDropContainer>
                <DragAndDrop handleDrop={handleDrop} no='2' fileUploaded={proofOfAddress2} />
              </DragAndDropContainer>
            )}
          </ContentWrapper>
          <ContentDivider />
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
