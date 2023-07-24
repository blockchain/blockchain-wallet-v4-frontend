import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { NodeItem, NodeItemTypes, NodeTextType } from '@core/types'
import { BlockchainLoader, Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import CheckBox from 'components/Form/CheckBox'
import Form from 'components/Form/Form'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import SelectBox from 'components/Form/SelectBox'
import TextBox from 'components/Form/TextBox'
import { model } from 'data'
import { getFormattedMessageComponent } from 'services/FormattedMessage/getFormattedMessageComponent'
import { required, validFormat } from 'services/forms'

import { Props as OwnProps, SuccessStateType } from '.'
import { GetInputPlaceholder, GetNodeQuestionElements } from './model'

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
  align-items: left;
`

const TopHeader = styled(Text)`
  display: flex;
  align-items: left;
  margin-bottom: 16px;
  flex-direction: column;
`

const TopHeaderTitle = styled.div`
  display: flex;
  align-items: left;
`

const TopHeaderDescription = styled(Text)`
  margin: 10px 0 0 0;
  display: flex;
  color: ${(props) => props.theme.grey600};
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
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
  font-weight: 400;
  font-size: 16px;
  max-width: 312px;
  color: ${(props) => props.theme.grey900};
`
export const DropdownStyled = styled.div`
  z-index: 9;
  background-color: ${(props) => props.theme.white};
`
export const CenterField = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const LabelItem = styled.label`
  cursor: pointer;
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

  const validateMultiSelectNodes = (): boolean => {
    const { nodes } = props.extraSteps
    if (nodes) {
      const multipleSelection = nodes.filter(
        (node) => node.type === NodeItemTypes.MULTIPLE_SELECTION
      )

      if (multipleSelection) {
        const multipleItems = multipleSelection.map(
          (node) => node.children && node.children.some((item) => item.checked)
        )
        return multipleItems.every((item) => item)
      }
    }
    return true
  }

  const updateItem = (nodeId: string, childId: string) => {
    props.formActions.change(KYC_EXTRA_QUESTIONS_FORM, nodeId, childId)

    const { blocking, context, nodes } = props.extraSteps
    let isChanged = false

    nodes.forEach(
      (node) =>
        node.id === nodeId &&
        node.children &&
        node.children.forEach((child) => {
          if (child.id === childId) {
            child.checked = !child.checked
            isChanged = true
          }
          // remove all other checked values
          if (
            child.id !== childId &&
            child.checked &&
            (node.type !== NodeItemTypes.MULTIPLE_SELECTION ||
              // remove all for dropdown items
              (node.type !== NodeItemTypes.MULTIPLE_SELECTION && node.isDropdown))
          ) {
            child.checked = false
            isChanged = true
          }
        })
    )
    if (isChanged) {
      props.identityVerificationActions.updateExtraKYCQuestions({ blocking, context, nodes })
    }
  }

  const updateMultiSelectItem = (nodeId: string, allSelectedItems: Array<string>) => {
    props.formActions.change(KYC_EXTRA_QUESTIONS_FORM, nodeId, nodeId)

    const { blocking, context, nodes } = props.extraSteps

    nodes.forEach(
      (node) =>
        node.id === nodeId &&
        node.children &&
        node.children.forEach((child) => {
          child.checked = allSelectedItems.includes(child.id)
        })
    )
    props.identityVerificationActions.updateExtraKYCQuestions({ blocking, context, nodes })
  }

  const onChangeInput = (e, value) => {
    const itemId = e.currentTarget.name

    const { blocking, context, nodes } = props.extraSteps
    const isChanged = false

    nodes.forEach((node) => {
      if (node.children) {
        node.children.forEach(
          (child) =>
            child.children &&
            child.children.forEach((item) => {
              if (item.id === itemId && item.input !== value) {
                item.input = value
              }
            })
        )
      }
      if (node.id === itemId && node.input !== value) {
        node.input = value
      }
    })

    if (isChanged) {
      props.identityVerificationActions.updateExtraKYCQuestions({ blocking, context, nodes })
    }
  }

  const renderCheckBoxBasedQuestion = (node: NodeItem) => {
    const nodeTranslation = {
      instructions: getFormattedMessageComponent(`${node.id}_instructions`),
      title: getFormattedMessageComponent(node.id)
    }
    return (
      <FormGroup key={node.id}>
        <QuestionTitle>{nodeTranslation.title}</QuestionTitle>

        <QuestionDescription>{nodeTranslation.instructions}</QuestionDescription>

        {node.children &&
          node.children.map((child) => {
            return (
              <LabelItem htmlFor={child.id} key={`checkbox-${child.id}`}>
                <FormItem>
                  <CheckBoxContainer>
                    <CenterField>
                      <CheckBoxText>{getFormattedMessageComponent(child.id)}</CheckBoxText>
                    </CenterField>
                    <CenterField>
                      <Field
                        name={child.id}
                        id={child.id}
                        value={child.id}
                        component={CheckBox}
                        type='checkbox'
                        onChange={() => updateItem(node.id, child.id)}
                        data-testId={`text-box-${node.id}`}
                      />
                    </CenterField>
                  </CheckBoxContainer>
                </FormItem>
              </LabelItem>
            )
          })}
      </FormGroup>
    )
  }

  const RenderSingleSelectionQuestion = (node: NodeItem) => {
    const formValue = props?.formValues ? props?.formValues[node.id] : null
    const nodeTranslation = {
      instructions: getFormattedMessageComponent(`${node.id}_instructions`),
      title: getFormattedMessageComponent(node.id)
    }
    // BE will provide id to contains OPTIONAL in any children
    const isOptional = node.children && node.children.some((item) => item.id.includes('UNDEFINED'))

    return (
      <>
        <FormGroup key={node.id}>
          <QuestionTitle>{nodeTranslation.title}</QuestionTitle>

          <QuestionDescription>{nodeTranslation.instructions}</QuestionDescription>

          <FormItem>
            {node.children &&
              node.children.map((child) => {
                return (
                  <LabelItem htmlFor={child.id} key={child.id}>
                    <CheckBoxContainer>
                      <CenterField>
                        <CheckBoxText>{getFormattedMessageComponent(child.id)}</CheckBoxText>
                      </CenterField>
                      <CenterField>
                        <Field
                          component='input'
                          type='radio'
                          name={node.id}
                          id={child.id}
                          value={child.id}
                          validate={isOptional ? null : required}
                          onChange={() => updateItem(node.id, child.id)}
                        />
                      </CenterField>
                    </CheckBoxContainer>
                  </LabelItem>
                )
              })}
          </FormItem>
        </FormGroup>

        {formValue &&
          node.children &&
          node.children.map(
            (child) =>
              child.children &&
              formValue === child.id && (
                <FormGroup key={`form-group-${child.id}`}>
                  {child.children.map((item, index) => {
                    return (
                      <FormItem
                        key={`form-item-${item.id}`}
                        style={{ marginTop: index > 0 ? '5px' : null }}
                      >
                        <Label htmlFor={item.id}>
                          <Text weight={500} size='14px' color='grey900'>
                            {getFormattedMessageComponent(item.id)}
                          </Text>
                        </Label>
                        <Field
                          name={item.id}
                          errorBottom
                          validate={isOptional ? null : required}
                          component={TextBox}
                          placeholder={GetInputPlaceholder(item)}
                          onChange={onChangeInput}
                        />
                      </FormItem>
                    )
                  })}
                </FormGroup>
              )
          )}
      </>
    )
  }

  const RenderTextBoxQuestion = (node: NodeTextType) => {
    const validFormatCb = useCallback(() => validFormat(node.regex), [node.regex])
    const validations = [required, validFormatCb]
    const displayInstructions = node.instructions && !!node.instructions.length

    const nodeTranslation = {
      field: getFormattedMessageComponent(`${node.id}hint`),
      instructions: getFormattedMessageComponent(`${node.id}_instructions`),
      title: getFormattedMessageComponent(node.id)
    }

    return (
      <FormGroup key={node.id}>
        <QuestionTitle>{nodeTranslation.title}</QuestionTitle>

        {displayInstructions && (
          <QuestionDescription>{nodeTranslation.instructions}</QuestionDescription>
        )}

        <FormItem key={node.id} style={{ marginBottom: '10px' }}>
          <Field
            name={node.id}
            errorBottom
            validate={validations}
            component={TextBox}
            placeholder={GetInputPlaceholder(node)}
            pattern={node.regex || ''}
            onChange={onChangeInput}
            data-testId='text-box97904904'
          />
        </FormItem>
      </FormGroup>
    )
  }

  const RenderHeader = (header) => {
    const headerTranslation = {
      description: getFormattedMessageComponent('header.description'),
      title: getFormattedMessageComponent('header.title')
    }

    return (
      <TopHeader color='grey800' size='20px' weight={600}>
        <Icon
          name='user'
          size='27px'
          color='blue600'
          style={{ marginBottom: '10px', marginRight: '4px' }}
        />
        <TopHeaderTitle>{headerTranslation.title}</TopHeaderTitle>
        {header.description && (
          <TopHeaderDescription>{headerTranslation.description}</TopHeaderDescription>
        )}
      </TopHeader>
    )
  }

  const RenderDropDownBasedQuestion = (node: NodeItem) => {
    const questionElements = GetNodeQuestionElements(node)

    const onChangeItem = (e, value) => {
      updateItem(node.id, value)
    }

    const onChangeMultiItem = (e, value) => {
      if (value?.length) {
        const allSelectedItems = value.map((item) => item.value)
        updateMultiSelectItem(node.id, allSelectedItems)
      }
    }

    const formValue = props?.formValues ? props?.formValues[node.id] : null

    const nodeTranslation = {
      instructions: getFormattedMessageComponent(`${node.id}_instructions`),
      title: getFormattedMessageComponent(node.id)
    }

    // BE will provide id to contains OPTIONAL in any children
    const isOptional = node.children && node.children.some((item) => item.id.includes('UNDEFINED'))

    return (
      <FormGroup key={node.id}>
        <QuestionTitle>
          {nodeTranslation.title !== '' ? nodeTranslation.title : node.text}
        </QuestionTitle>
        <QuestionDescription>
          {nodeTranslation.instructions !== '' ? nodeTranslation.instructions : node.instructions}
        </QuestionDescription>
        <FormItem>
          {node.type === NodeItemTypes.MULTIPLE_SELECTION ? (
            <Field
              data-e2e={`sourceOfFundsDropDown_${node.id}`}
              name={node.id}
              validate={isOptional ? null : required}
              elements={questionElements}
              component={SelectBox}
              menuPlacement='auto'
              isMulti
              onChange={onChangeMultiItem}
            />
          ) : (
            <Field
              data-e2e={`sourceOfFundsDropDown_${node.id}`}
              name={node.id}
              validate={isOptional ? null : required}
              elements={questionElements}
              component={SelectBox}
              menuPlacement='auto'
              onChange={onChangeItem}
            />
          )}
        </FormItem>
        {formValue &&
          node.children &&
          node.children.map(
            (child) =>
              child.children &&
              formValue === child.id && (
                <FormItem style={{ marginTop: '10px' }} key={`option-${child.id}`}>
                  {child.children.map((item) => {
                    if (item.type === NodeItemTypes.MULTIPLE_SELECTION) {
                      return item.isDropdown
                        ? RenderDropDownBasedQuestion(item)
                        : renderCheckBoxBasedQuestion(item)
                    }
                    if (
                      item.type === NodeItemTypes.SINGLE_SELECTION ||
                      item.type === NodeItemTypes.SELECTION
                    ) {
                      return item.isDropdown
                        ? RenderDropDownBasedQuestion(item)
                        : RenderSingleSelectionQuestion(item)
                    }
                    if (item.type === NodeItemTypes.OPEN_ENDED) {
                      return (
                        <Field
                          key={item.id}
                          name={item.id}
                          errorBottom
                          validate={isOptional ? null : required}
                          component={TextBox}
                          onChange={onChangeInput}
                          data-testId='text-box'
                        />
                      )
                    }
                    return null
                  })}
                </FormItem>
              )
          )}
      </FormGroup>
    )
  }

  return (
    <CustomForm onSubmit={props.handleSubmit}>
      <FlyoutWrapper style={{ borderBottom: 'grey000', paddingBottom: '0px' }}>
        {props.extraSteps.header && RenderHeader(props.extraSteps.header)}
        {!props.extraSteps.header && (
          <TopText color='grey800' size='20px' weight={600}>
            <LeftTopCol>
              <FormattedMessage
                id='identityverification.extra_fields.title'
                defaultMessage='Use of Account Information'
              />
            </LeftTopCol>
          </TopText>
        )}
      </FlyoutWrapper>
      <FlyoutWrapper style={{ paddingTop: '20px' }}>
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
            if (node.type === NodeItemTypes.MULTIPLE_SELECTION) {
              return node.isDropdown
                ? RenderDropDownBasedQuestion(node)
                : renderCheckBoxBasedQuestion(node)
            }
            if (
              node.type === NodeItemTypes.SINGLE_SELECTION ||
              node.type === NodeItemTypes.SELECTION
            ) {
              return node.isDropdown
                ? RenderDropDownBasedQuestion(node)
                : RenderSingleSelectionQuestion(node)
            }
            if (node.type === NodeItemTypes.OPEN_ENDED) {
              return RenderTextBoxQuestion(node)
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
          disabled={disabled || !validateMultiSelectNodes()}
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
