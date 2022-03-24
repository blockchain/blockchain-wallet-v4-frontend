import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { BlockchainLoader, Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { CheckBox, Form, FormGroup, FormItem, SelectBox, TextBox } from 'components/Form'
import { model } from 'data'
import { required } from 'services/forms'

import { Props as OwnProps, SuccessStateType } from '.'
import { getQuestionElements } from './model'

const { KYC_EXTRA_QUESTIONS_FORM } = model.components.identityVerification

export const Label = styled.label`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  display: block;
  color: ${(props) => props.theme.grey900};
`
const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`

export const FullNameContainer = styled.div`
  justify-content: space-between;
  display: flex;
  flex-direction: row;
`

export const CaptionContainer = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: row;
`
export const Caption = styled(Text)`
  font-weight: 500;
  font-size: 12px;
  line-height: 150%;
  color: ${(props) => props.theme.grey600};
`
const CustomForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`
const LeftTopCol = styled.div`
  display: flex;
  align-items: center;
`

const ErrorTextContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
`
const QuestionTitle = styled(Text)`
  display: flex;
  color: ${(props) => props.theme.grey900};
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
`
const QuestionDescription = styled(Text)`
  margin: 4px 0 12px 0;
  display: flex;
  color: ${(props) => props.theme.grey600};
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
`

const ErrorText = styled(Text)`
  display: inline-flex;
  font-weight: 500;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 32px;
  background-color: ${(props) => props.theme.red000};
  color: ${(props) => props.theme.red800};
  margin-bottom: 16px;
`

export const CheckBoxContainer = styled.div`
  height: 64px;
  margin: 4px 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 12px 24px;
  border: 1px solid ${(props) => props.theme.grey000};
  box-sizing: border-box;
  border-radius: 8px;
`

export const CheckBoxText = styled(Text)`
  font-weight: 600;
  font-size: 16px;
  max-width: 312px;
  color: ${(props) => props.theme.grey600};
`
export const CenterField = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Success: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => {
  const disabled = props.invalid || props.submitting

  if (props.submitting) {
    return (
      <SpinnerWrapper>
        <BlockchainLoader width='80px' height='80px' />
      </SpinnerWrapper>
    )
  }

  const getElementsSourceOfFunds = getQuestionElements(props.extraSteps.nodes, 'q2')
  const getSourceOfFundsElements = getQuestionElements(props.extraSteps.nodes, 'q3')

  const onChangeNatureAndPurpose = (e, value) => {
    props.formActions.change(KYC_EXTRA_QUESTIONS_FORM, value, value)
  }
  const onSourceOfFundsChange = (e, value) => {
    props.formActions.change(KYC_EXTRA_QUESTIONS_FORM, 'q2', value)
  }

  const onActingOnBehalfChange = (e, value) => {
    props.formActions.change(KYC_EXTRA_QUESTIONS_FORM, 'q3', value)
  }

  return (
    <CustomForm onSubmit={props.handleSubmit}>
      <FlyoutWrapper style={{ borderBottom: 'grey000', paddingBottom: '0px' }}>
        <TopText color='grey800' size='20px' weight={600}>
          <LeftTopCol>
            <Icon
              cursor
              data-e2e='kycBackToCryptoSelection'
              name='arrow-left'
              size='20px'
              color='grey600'
              role='button'
              style={{ marginRight: '8px' }}
              onClick={props.onClose}
            />
            <FormattedMessage
              id='identityverification.extra_fields.title'
              defaultMessage='Use of Account Information'
            />
          </LeftTopCol>
        </TopText>
      </FlyoutWrapper>
      <FlyoutWrapper style={{ paddingTop: '36px' }}>
        {props.error && (
          <ErrorTextContainer>
            <ErrorText>
              <Icon name='alert-filled' color='red600' style={{ marginRight: '4px' }} />
              Error: {props.error}
            </ErrorText>
          </ErrorTextContainer>
        )}
        <FormGroup>
          <QuestionTitle>
            <FormattedMessage
              id='identityverification.extra_fields.question1.title'
              defaultMessage='Nature & Purpose of Business Relationship'
            />
          </QuestionTitle>

          <QuestionDescription>
            <FormattedMessage
              id='identityverification.extra_fields.select_all'
              defaultMessage='(Select all that apply)'
            />
          </QuestionDescription>

          <FormItem>
            <CheckBoxContainer>
              <CenterField>
                <CheckBoxText>
                  <FormattedMessage
                    id='identityverification.extra_fields.question1.option1'
                    defaultMessage='Buy cryptocurrency with cards or bank transfer'
                  />
                </CheckBoxText>
              </CenterField>
              <CenterField>
                <Field
                  name='q1-a1'
                  id='q1'
                  value='q1-a1'
                  component={CheckBox}
                  type='checkbox'
                  onChange={onChangeNatureAndPurpose}
                />
              </CenterField>
            </CheckBoxContainer>
          </FormItem>
          <FormItem>
            <CheckBoxContainer>
              <CenterField>
                <CheckBoxText>
                  <FormattedMessage
                    id='identityverification.extra_fields.question1.option2'
                    defaultMessage='Swap my cryptocurrencies'
                  />
                </CheckBoxText>
              </CenterField>
              <CenterField>
                <Field
                  name='q1-a2'
                  id='q2'
                  value='q1-a2'
                  component={CheckBox}
                  type='checkbox'
                  onChange={onChangeNatureAndPurpose}
                />
              </CenterField>
            </CheckBoxContainer>
          </FormItem>
          <FormItem>
            <CheckBoxContainer>
              <CenterField>
                <CheckBoxText>
                  <FormattedMessage
                    id='identityverification.extra_fields.question1.option3'
                    defaultMessage='Send Cryptocurrencies to family or friends'
                  />
                </CheckBoxText>
              </CenterField>
              <CenterField>
                <Field
                  name='q1-a3'
                  id='q3'
                  value='q1-a3'
                  component={CheckBox}
                  type='checkbox'
                  onChange={onChangeNatureAndPurpose}
                />
              </CenterField>
            </CheckBoxContainer>
          </FormItem>
          <FormItem>
            <CheckBoxContainer>
              <CenterField>
                <CheckBoxText>
                  <FormattedMessage
                    id='identityverification.extra_fields.question1.option4'
                    defaultMessage='Online Purchases'
                  />
                </CheckBoxText>
              </CenterField>
              <CenterField>
                <Field
                  name='q1-a4'
                  id='q4'
                  value='q1-a4'
                  component={CheckBox}
                  type='checkbox'
                  onChange={onChangeNatureAndPurpose}
                />
              </CenterField>
            </CheckBoxContainer>
          </FormItem>
          <FormItem>
            <CheckBoxContainer>
              <CenterField>
                <CheckBoxText>
                  <FormattedMessage
                    id='identityverification.extra_fields.question1.option5'
                    defaultMessage='Business'
                  />
                </CheckBoxText>
              </CenterField>
              <CenterField>
                <Field
                  name='q1-a5'
                  id='q5'
                  value='q1-a5'
                  component={CheckBox}
                  type='checkbox'
                  onChange={onChangeNatureAndPurpose}
                />
              </CenterField>
            </CheckBoxContainer>
          </FormItem>
        </FormGroup>
        <FormGroup>
          <QuestionTitle>
            <FormattedMessage
              id='identityverification.extra_fields.question2.title'
              defaultMessage='Source of Funds'
            />
          </QuestionTitle>

          <QuestionDescription>
            <FormattedMessage
              id='identityverification.extra_fields.select_one'
              defaultMessage='(Select only one)'
            />
          </QuestionDescription>

          <FormItem>
            <Field
              data-e2e='sourceOfFundsDropDown'
              name='q2'
              validate={required}
              elements={getElementsSourceOfFunds}
              component={SelectBox}
              menuPlacement='auto'
              onChange={onSourceOfFundsChange}
            />
          </FormItem>
          {props?.formValues?.q2 === 'q2-a8' && (
            <FormItem style={{ marginTop: '10px' }}>
              <Field
                name='q2-a8-a1'
                errorBottom
                validate={required}
                component={TextBox}
                placeholder='Enter source of funds here'
              />
            </FormItem>
          )}
        </FormGroup>
        <FormGroup>
          <QuestionTitle>
            <FormattedMessage
              id='identityverification.extra_fields.question3.title'
              defaultMessage='Are You Acting On Your Behalf?'
            />
          </QuestionTitle>

          <QuestionDescription>
            <FormattedMessage
              id='identityverification.extra_fields.select_one'
              defaultMessage='(Select only one)'
            />
          </QuestionDescription>

          <FormItem>
            <Field
              data-e2e='actingOnBehalfDropDown'
              name='q3'
              validate={required}
              elements={getSourceOfFundsElements}
              component={SelectBox}
              menuPlacement='auto'
              onChange={onActingOnBehalfChange}
            />
          </FormItem>
        </FormGroup>
        <FormGroup>
          <QuestionTitle>
            <FormattedMessage
              id='identityverification.extra_fields.question4.title'
              defaultMessage='Are you a Politically Exposed Person (PEP)?'
            />
          </QuestionTitle>

          <QuestionDescription>
            <FormattedMessage
              id='identityverification.extra_fields.select_one'
              defaultMessage='(Select only one)'
            />
          </QuestionDescription>

          <FormItem>
            <CheckBoxContainer>
              <CenterField>
                <CheckBoxText>
                  <FormattedMessage
                    id='identityverification.extra_fields.question4.option1'
                    defaultMessage='No'
                  />
                </CheckBoxText>
              </CenterField>
              <CenterField>
                <Field
                  component='input'
                  type='radio'
                  name='q4'
                  value='q4-a1'
                  validate={required}
                  onChange={() => props.formActions.change(KYC_EXTRA_QUESTIONS_FORM, 'q4', 'q4-a3')}
                />
              </CenterField>
            </CheckBoxContainer>
            <CheckBoxContainer>
              <CenterField>
                <CheckBoxText>
                  <FormattedMessage
                    id='identityverification.extra_fields.question4.option2'
                    defaultMessage='Yes, I Am'
                  />
                </CheckBoxText>
              </CenterField>
              <CenterField>
                <Field
                  component='input'
                  type='radio'
                  name='q4'
                  value='q4-a2'
                  validate={required}
                  onChange={() => props.formActions.change(KYC_EXTRA_QUESTIONS_FORM, 'q4', 'q4-a1')}
                />
              </CenterField>
            </CheckBoxContainer>
            <CheckBoxContainer>
              <CenterField>
                <CheckBoxText>
                  <FormattedMessage
                    id='identityverification.extra_fields.question4.option3'
                    defaultMessage='Yes, My Family Member Or Close Associate Is'
                  />
                </CheckBoxText>
              </CenterField>
              <CenterField>
                <Field
                  component='input'
                  type='radio'
                  name='q4'
                  value='q4-a3'
                  validate={required}
                  onChange={() => props.formActions.change(KYC_EXTRA_QUESTIONS_FORM, 'q4', 'q4-a2')}
                />
              </CenterField>
            </CheckBoxContainer>
          </FormItem>
        </FormGroup>
        {props?.formValues?.q4 === 'q4-a3' && (
          <FormGroup>
            <FormItem>
              <Label htmlFor='fullName'>
                <Text weight={500} size='14px' color='grey900'>
                  <FormattedMessage
                    id='identityverification.extra_fields.question4.full_name'
                    defaultMessage='Full Name'
                  />
                </Text>
              </Label>
              <Field
                name='q4-a3-a1'
                errorBottom
                validate={required}
                component={TextBox}
                placeholder='John Smith'
              />
            </FormItem>
            <FormItem style={{ marginTop: '5px' }}>
              <Label htmlFor='relationship'>
                <Text weight={500} size='14px' color='grey900'>
                  <FormattedMessage
                    id='identityverification.extra_fields.question4.relationship'
                    defaultMessage='Their Relationship To You'
                  />
                </Text>
              </Label>
              <Field
                name='q4-a3-a2'
                errorBottom
                validate={required}
                component={TextBox}
                placeholder='Family Member'
              />
            </FormItem>
          </FormGroup>
        )}
        <Button
          data-e2e='submitKYCExtraQuestionsForm'
          height='48px'
          size='16px'
          nature='primary'
          type='submit'
          fullwidth
          disabled={disabled}
        >
          {props.submitting ? (
            <HeartbeatLoader height='16px' width='16px' color='white' />
          ) : (
            <FormattedMessage id='buttons.next' defaultMessage='Next' />
          )}
        </Button>
      </FlyoutWrapper>
    </CustomForm>
  )
}

export type Props = OwnProps & SuccessStateType

export default reduxForm<{}, Props>({
  destroyOnUnmount: false,
  form: KYC_EXTRA_QUESTIONS_FORM
})(Success)
