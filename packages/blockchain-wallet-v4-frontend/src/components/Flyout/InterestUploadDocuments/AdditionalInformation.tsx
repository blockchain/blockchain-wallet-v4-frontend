import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { Form, FormItem, FormLabel, TextBox } from 'components/Form'
import { model } from 'data'
import { InterestUploadDocumentFormValueTypes } from 'data/types'

import Container from '../Container'
import Content from '../Content'
import Footer from '../Footer'
import Header from '../Header'

const { INTEREST_UPLOAD_DOCUMENT } = model.components.interestUploadDocument

const ContentWrapper = styled.div`
  display: flex;
  padding: 40px 40px 0 40px;
`

const TextContentWrapper = styled.div`
  padding: 0 40px;
  display: flex;
  flex-direction: column;
`

export const ContentDivider = styled.div`
  height: 20px;
  border-bottom: 1px solid ${(props) => props.theme.grey000};
  margin-bottom: 40px;
`

const AdditionalInformation: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => {
  const closeModal = useCallback(() => {
    props.close()
  }, [])

  const disabled =
    props.invalid ||
    props.submitting ||
    !props.formValues ||
    (props.formValues && (!props?.formValues.jobTitle || !props?.formValues?.totalAmount))

  return (
    <Container>
      <Form onSubmit={props.handleSubmit}>
        <Header data-e2e='InterestUploadDocumentsCloseButton' mode='back' onClick={closeModal}>
          <FormattedMessage
            id='modals.interest.withdrawal.upload_documents.additional_info.headline'
            defaultMessage='Additional Information'
          />
        </Header>
        <Content mode='top'>
          <TextContentWrapper>
            <Text size='14px' weight={500} color='grey900' lineHeight='20px'>
              <FormattedMessage
                id='modals.interest.withdrawal.upload_documents.additional_info.description'
                defaultMessage='Please fill in this form to the best of your knowledge and then proceed to upload documents in the next screen.'
              />
            </Text>
          </TextContentWrapper>
          <ContentWrapper>
            <FormItem>
              <FormLabel htmlFor='jobTitle'>
                <Text weight={600} size='14px' color='grey900'>
                  <FormattedMessage
                    id='modals.interest.withdrawal.upload_documents.additional_info.current_job'
                    defaultMessage='Current Job Title or Occupation'
                  />
                </Text>
              </FormLabel>
              <Field name='jobTitle' errorBottom component={TextBox} />
            </FormItem>
          </ContentWrapper>
          <ContentDivider />
          <TextContentWrapper>
            <Text size='14px' weight={500} color='grey900' lineHeight='20px'>
              <FormattedMessage
                id='modals.interest.withdrawal.upload_documents.additional_info.intend_title'
                defaultMessage='What’s the intended use of account?'
              />
            </Text>
          </TextContentWrapper>
          <ContentWrapper>
            <FormItem>
              <FormLabel htmlFor='totalAmount'>
                <Text weight={600} size='14px' color='grey900'>
                  <FormattedMessage
                    id='modals.interest.withdrawal.upload_documents.additional_info.total_amount'
                    defaultMessage='Total Amount of funds to be Deposited & Currencies'
                  />
                </Text>
              </FormLabel>
              <Field name='totalAmount' errorBottom component={TextBox} />
            </FormItem>
          </ContentWrapper>
          <ContentDivider />
          <TextContentWrapper>
            <Text size='14px' weight={500} color='grey900' lineHeight='20px'>
              <FormattedMessage
                id='modals.interest.withdrawal.upload_documents.additional_info.ssn_title'
                defaultMessage='What is your Social Security Number?'
              />
            </Text>
          </TextContentWrapper>
          <ContentWrapper>
            <FormItem>
              <FormLabel htmlFor='ssn'>
                <Text weight={600} size='14px' color='grey900'>
                  <FormattedMessage
                    id='modals.interest.withdrawal.upload_documents.additional_info.ssn'
                    defaultMessage='SSN (US Only)'
                  />
                </Text>
              </FormLabel>
              <Field name='ssn' errorBottom component={TextBox} />
            </FormItem>
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
          <FormattedMessage id='buttons.next' defaultMessage='Next' />
        </Button>
      </Footer>
    </Container>
  )
}

export type Props = {
  close: () => void
  formValues: InterestUploadDocumentFormValueTypes
  handleSubmit: () => void
  nextStep: () => void
}

export default reduxForm<{}, Props>({
  destroyOnUnmount: false,
  form: INTEREST_UPLOAD_DOCUMENT
})(AdditionalInformation)
