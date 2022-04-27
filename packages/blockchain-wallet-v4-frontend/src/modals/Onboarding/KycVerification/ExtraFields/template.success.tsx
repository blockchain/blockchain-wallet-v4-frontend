import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { NodeType } from '@core/types'
import { BlockchainLoader, Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import CheckBox from 'components/Form/CheckBox'
import Form from 'components/Form/Form'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import SelectBox from 'components/Form/SelectBox'
import TextBox from 'components/Form/TextBox'
import { model } from 'data'
import { required } from 'services/forms'

import { Props as OwnProps, SuccessStateType } from '.'
import { getNodeQuestionElements } from './model'

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

  const updateItem = (nodeId: string, childId: string) => {
    props.formActions.change(KYC_EXTRA_QUESTIONS_FORM, nodeId, childId)
  }

  const renderCheckBoxBasedQuestion = (node: NodeType, updateItem) => {
    return (
      <FormGroup>
        <QuestionTitle>{node.text}</QuestionTitle>

        <QuestionDescription>{node.instructions}</QuestionDescription>

        {node.children &&
          node.children.map((child) => {
            return (
              <FormItem key={child.id}>
                <CheckBoxContainer>
                  <CenterField>
                    <CheckBoxText>{child.text}</CheckBoxText>
                  </CenterField>
                  <CenterField>
                    <Field
                      name={child.id}
                      id={child.id}
                      value={child.id}
                      component={CheckBox}
                      type='checkbox'
                      onChange={() => updateItem(node.id, child.id)}
                    />
                  </CenterField>
                </CheckBoxContainer>
              </FormItem>
            )
          })}
      </FormGroup>
    )
  }

  const renderDropDownBasedQuestion = (node: NodeType, updateItem) => {
    const questionElements = getNodeQuestionElements(node)

    const onChangeItem = (e, value) => {
      updateItem(node.id, value)
    }

    const formValue = props?.formValues ? props?.formValues[node.id] : null

    return (
      <FormGroup>
        <QuestionTitle>{node.text}</QuestionTitle>

        <QuestionDescription>{node.instructions}</QuestionDescription>

        <FormItem>
          <Field
            data-e2e='sourceOfFundsDropDown'
            name={node.id}
            validate={required}
            elements={questionElements}
            component={SelectBox}
            menuPlacement='auto'
            onChange={onChangeItem}
          />
        </FormItem>

        {formValue &&
          node.children.map(
            (child) =>
              child.children &&
              formValue === child.id && (
                <FormItem style={{ marginTop: '10px' }}>
                  {child.children.map((item) => (
                    <Field
                      key={item.id}
                      name={item.id}
                      errorBottom
                      validate={required}
                      component={TextBox}
                      placeholder={item.text}
                    />
                  ))}
                </FormItem>
              )
          )}
      </FormGroup>
    )
  }

  const renderSingleSelectionQuestion = (node: NodeType, updateItem) => {
    const formValue = props?.formValues ? props?.formValues[node.id] : null

    return (
      <>
        <FormGroup>
          <QuestionTitle>{node.text}</QuestionTitle>

          <QuestionDescription>{node.instructions}</QuestionDescription>

          <FormItem>
            {node.children &&
              node.children.map((child) => {
                return (
                  <CheckBoxContainer key={child.id}>
                    <CenterField>
                      <CheckBoxText>{child.text}</CheckBoxText>
                    </CenterField>
                    <CenterField>
                      <Field
                        component='input'
                        type='radio'
                        name={node.id}
                        value={child.id}
                        validate={required}
                        onChange={() => updateItem(node.id, child.id)}
                      />
                    </CenterField>
                  </CheckBoxContainer>
                )
              })}
          </FormItem>
        </FormGroup>

        {formValue &&
          node.children.map(
            (child) =>
              child.children &&
              formValue === child.id && (
                <FormGroup>
                  {child.children.map((item, index) => (
                    <FormItem key={item.id} style={{ marginTop: index > 0 ? '5px' : null }}>
                      <Label htmlFor={item.id}>
                        <Text weight={500} size='14px' color='grey900'>
                          {item.text}
                        </Text>
                      </Label>
                      <Field
                        name={item.id}
                        errorBottom
                        validate={required}
                        component={TextBox}
                        placeholder={item.hint}
                      />
                    </FormItem>
                  ))}
                </FormGroup>
              )
          )}
      </>
    )
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

        {props.extraSteps.nodes &&
          props.extraSteps.nodes.map((node) => {
            if (node.type === 'MULTIPLE_SELECTION') {
              return renderCheckBoxBasedQuestion(node, updateItem)
            }
            if (node.type === 'SINGLE_SELECTION') {
              return node.isDropdown
                ? renderDropDownBasedQuestion(node, updateItem)
                : renderSingleSelectionQuestion(node, updateItem)
            }
            return null
          })}

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
