import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { Field, getFormValues, reduxForm } from 'redux-form'

import { HeaderType, NodeItem, NodeItemTypes, NodeTextType } from '@core/types'
import { BlockchainLoader, Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import {
  FlyoutContainer,
  FlyoutContent,
  FlyoutFooter,
  FlyoutHeader
} from 'components/Flyout/Layout'
import CheckBox from 'components/Form/CheckBox'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import SelectBox from 'components/Form/SelectBox'
import TextBox from 'components/Form/TextBox'
import { required, validFormat } from 'services/forms'

import {
  GetInputPlaceholder,
  GetNodeQuestionElements
} from '../../KycVerification/ExtraFields/model'
import { SpinnerWrapper } from '../../KycVerification/UserAddress/UserAddress.model'
import {
  CenterField,
  CheckBoxContainer,
  CheckBoxText,
  CustomForm,
  ErrorText,
  ErrorTextContainer,
  FooterWrapper,
  Label,
  LabelItem,
  QuestionDescription,
  QuestionTitle,
  StyledAnchor,
  TopHeader,
  TopHeaderDescription,
  TopHeaderTitle
} from './model'
import { IntroPageType, SelfAssessmentType } from './types'

type Props = {
  dataRef: React.MutableRefObject<SelfAssessmentType>
  handleClose: () => void
  introPage: IntroPageType | {}
  nodes: any
  step: number
}

const Success = ({
  change,
  dataRef,
  error,
  handleClose,
  handleSubmit,
  introPage,
  invalid,
  nodes,
  step,
  submitting
}) => {
  const formValues = useSelector(getFormValues('SelfAssessment')) ?? {}
  const disabled = invalid || submitting

  if (submitting) {
    return (
      <SpinnerWrapper>
        <BlockchainLoader width='80px' height='80px' />
      </SpinnerWrapper>
    )
  }

  const validateMultiSelectNodes = (): boolean => {
    if (nodes) {
      const multipleSelection = nodes.filter(
        (node) => node.type === NodeItemTypes.MULTIPLE_SELECTION
      )

      if (multipleSelection) {
        const multipleItems = multipleSelection.map((node) =>
          node.children?.some((item) => item.checked)
        )

        return multipleItems.every((item) => item)
      }
    }

    return true
  }

  const updateItem = (nodeId: string, childId: string) => {
    change(nodeId, childId)

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
      dataRef.current.pages[step].nodes = nodes
    }
  }

  const updateMultiSelectItem = (nodeId: string, allSelectedItems: Array<string>) => {
    change(nodeId, nodeId)

    nodes.forEach(
      (node) =>
        node.id === nodeId &&
        node.children &&
        node.children.forEach((child) => {
          child.checked = allSelectedItems.includes(child.id)
        })
    )

    dataRef.current.pages[step].nodes = nodes
  }

  const onChangeInput = (e, value) => {
    const itemId = e.currentTarget.name

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
  }

  const renderCheckBoxBasedQuestion = (node: NodeItem) => {
    const nodeTranslation = {
      instructions: node.instructions ?? '',
      title: node.text
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
    const formValue = formValues[node.id] ?? null
    const nodeTranslation = {
      instructions: node.instructions,
      title: node.text
    }
    // BE will provide id to contains OPTIONAL in any children
    const isOptional = node.children?.some((item) => item.id.includes('UNDEFINED'))

    return (
      <>
        <FormGroup key={node.id}>
          <QuestionTitle>{nodeTranslation.title}</QuestionTitle>

          {nodeTranslation.instructions && (
            <QuestionDescription>{nodeTranslation.instructions}</QuestionDescription>
          )}

          <FormItem>
            {node.children &&
              node.children.map((child) => {
                return (
                  <LabelItem htmlFor={child.id} key={child.id}>
                    <CheckBoxContainer>
                      <CenterField>
                        <CheckBoxText>{child.text}</CheckBoxText>
                        {child.description && (
                          <Text size='12px' color='grey600' weight={500}>
                            {child.description}
                          </Text>
                        )}
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
                            {item.text}
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
    const displayInstructions = !!node.instructions?.length

    const nodeTranslation = {
      field: node.hint ?? '',
      instructions: node.instructions ?? '',
      title: node.text
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

  const RenderHeader = (header: HeaderType) => (
    <TopHeader color='grey800' size='20px' weight={600}>
      {header.imageUrl ? (
        <img src={header.imageUrl} height='27px' alt='' />
      ) : (
        <Icon
          name='user'
          size='27px'
          color='blue600'
          style={{ marginBottom: '10px', marginRight: '4px' }}
        />
      )}
      {header.title && <TopHeaderTitle>{header.title}</TopHeaderTitle>}
      {header.description && <TopHeaderDescription>{header.description}</TopHeaderDescription>}
    </TopHeader>
  )

  const RenderFooter = (footer) => {
    return (
      <FooterWrapper>
        {footer.map((item) => {
          if (item.type === 'TEXT') {
            return (
              <Text size='14px' weight={500} color='grey900' lineHeight='21px' key={item.type}>
                {item.text}
              </Text>
            )
          }
          if (item.type === 'MINIMAL_BUTTON') {
            return (
              <StyledAnchor href={item.action.url} target='_blank' key={item.type}>
                <Text size='16px' color='blue600' weight={600} lineHeight='48px'>
                  {item.text}
                </Text>
              </StyledAnchor>
            )
          }
          return (
            <Button
              data-e2e={`introSelfAssessMentButton-${item.type}`}
              height='48px'
              size='16px'
              nature='primary'
              type='submit'
              fullwidth
              disabled={disabled || !validateMultiSelectNodes()}
              key={item.type}
            >
              {submitting ? (
                <HeartbeatLoader height='16px' width='16px' color='white' />
              ) : (
                <Text capitalize color='white' weight={600}>
                  {item.text}
                </Text>
              )}
            </Button>
          )
        })}
      </FooterWrapper>
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

    const formValue = formValues[node.id] ?? null

    const nodeTranslation = {
      instructions: node.instructions ?? '',
      title: node.text
    }

    // BE will provide id to contains OPTIONAL in any children
    const isOptional = node?.children?.some((item) => item.id.includes('UNDEFINED'))

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
    <FlyoutContainer>
      <CustomForm onSubmit={handleSubmit}>
        {!introPage?.header && (
          <FlyoutHeader mode='close' data-e2e='SelfAssessmentSuccess' onClick={handleClose} />
        )}
        <FlyoutContent mode={introPage?.header ? 'middle' : 'top'}>
          <FlyoutWrapper>
            {introPage?.header && RenderHeader(introPage?.header)}
            {error && (
              <ErrorTextContainer>
                <ErrorText>
                  <Icon name='alert-filled' color='red600' style={{ marginRight: '4px' }} />
                  Error: {error}
                </ErrorText>
              </ErrorTextContainer>
            )}

            {nodes &&
              nodes.map((node) => {
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
          </FlyoutWrapper>
        </FlyoutContent>
        <FlyoutFooter collapsed>
          {introPage?.footer?.length > 0 ? (
            RenderFooter(introPage?.footer)
          ) : (
            <Button
              data-e2e='submitKYCExtraQuestionsForm'
              height='48px'
              size='16px'
              nature='primary'
              type='submit'
              fullwidth
              disabled={disabled || !validateMultiSelectNodes()}
            >
              {submitting ? (
                <HeartbeatLoader height='16px' width='16px' color='white' />
              ) : (
                <FormattedMessage id='buttons.next' defaultMessage='Next' />
              )}
            </Button>
          )}
        </FlyoutFooter>
      </CustomForm>
    </FlyoutContainer>
  )
}

export default reduxForm<{}, Props>({
  form: 'selfAssessment'
})(Success)
