import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { Form, FormItem, FormLabel, TextBox } from 'components/Form'
import { model } from 'data'
import { InterestUploadDocumentFormValueTypes } from 'data/types'
import { required, requiredValidSSN } from 'services/forms'

import Container from '../Container'
import Content from '../Content'
import Footer from '../Footer'
import Header from '../Header'

const { INTEREST_UPLOAD_DOCUMENT } = model.components.interestUploadDocument

const MIN_LENGTH = 4

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

const CustomForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const minValue = (value: string) =>
  value && value.length < MIN_LENGTH ? (
    <FormattedMessage
      id='modals.interest.withdrawal.upload_documents.additional_info.error'
      defaultMessage='Must be at least {minChars} characters length'
      values={{
        minChars: MIN_LENGTH
      }}
    />
  ) : undefined

const AdditionalInformation: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => {
  const closeModal = useCallback(() => {
    props.close()
  }, [])

  const disabled = props.invalid || props.submitting || !props.formValues
  const isCountryUS = props?.countryCode === 'US'

  return (
    <Container>
      <CustomForm onSubmit={props.handleSubmit}>
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
                defaultMessage='Please fill out this form to the best of your knowledge and then proceed to upload documents on the next screen.'
              />
            </Text>
          </TextContentWrapper>
          <ContentWrapper>
            <FormItem>
              <FormLabel htmlFor='occupation'>
                <Text weight={600} size='14px' color='grey900'>
                  <FormattedMessage
                    id='modals.interest.withdrawal.upload_documents.additional_info.current_job'
                    defaultMessage='Current Job Title or Occupation'
                  />
                </Text>
              </FormLabel>
              <Field
                name='occupation'
                errorBottom
                component={TextBox}
                validate={[required, minValue]}
              />
            </FormItem>
          </ContentWrapper>
          <ContentDivider />
          <TextContentWrapper>
            <Text size='14px' weight={500} color='grey900' lineHeight='20px'>
              <FormattedMessage
                id='modals.interest.withdrawal.upload_documents.additional_info.intend_title'
                defaultMessage='What’s the intended use of the account?'
              />
            </Text>
          </TextContentWrapper>
          <ContentWrapper>
            <FormItem>
              <FormLabel htmlFor='expectedDeposits'>
                <Text weight={600} size='14px' color='grey900'>
                  <FormattedMessage
                    id='modals.interest.withdrawal.upload_documents.additional_info.total_amount'
                    defaultMessage='Expected amounts, currencies and period'
                  />
                </Text>
              </FormLabel>
              <Field
                name='expectedDeposits'
                errorBottom
                component={TextBox}
                validate={[required, minValue]}
                placeholder='over 100k, BTC, in a 2 years period'
              />
            </FormItem>
          </ContentWrapper>
          <ContentDivider />
          {isCountryUS && (
            <>
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
                  <Field
                    name='ssn'
                    errorBottom
                    component={TextBox}
                    validate={[requiredValidSSN]}
                    placeholder='123-1243-12412'
                  />
                </FormItem>
              </ContentWrapper>
            </>
          )}
        </Content>
        <Footer collapsed>
          <Button
            nature='primary'
            data-e2e='additionalInfoUploadDocument'
            type='submit'
            fullwidth
            height='48px'
            style={{ marginTop: '16px' }}
            disabled={disabled}
          >
            <FormattedMessage id='buttons.next' defaultMessage='Next' />
          </Button>
        </Footer>
      </CustomForm>
    </Container>
  )
}

export type Props = {
  close: () => void
  countryCode: string | null
  formValues: InterestUploadDocumentFormValueTypes
  handleSubmit: (e) => void
  nextStep: () => void
}

export default reduxForm<{}, Props>({
  destroyOnUnmount: false,
  form: INTEREST_UPLOAD_DOCUMENT
})(AdditionalInformation)
