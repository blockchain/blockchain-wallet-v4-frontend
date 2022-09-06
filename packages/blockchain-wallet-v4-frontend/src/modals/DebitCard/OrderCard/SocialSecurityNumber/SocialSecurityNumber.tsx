import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { BlockchainLoader, Button, HeartbeatLoader, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import {
  FlyoutContainer,
  FlyoutContent,
  FlyoutFooter,
  FlyoutHeader
} from 'components/Flyout/Layout'
import Form from 'components/Form/Form'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import TextBox from 'components/Form/TextBox'
import { Padding } from 'components/Padding'
import { actions, model } from 'data'
import { OrderCardStep } from 'data/components/debitCard/model'
import { required, requiredSSN } from 'services/forms'

const { SOCIAL_SECURITY_NUMBER_FORM } = model.components.debitCard

export const Label = styled.label`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  display: block;
  color: ${(props) => props.theme.grey900};
`

const CustomForm = styled(Form)`
  height: 100%;
`

const FormWrapper = styled(Flex)`
  height: 100%;
`

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`

const SocialSecurityNumber = ({ invalid, submitting }: InjectedFormProps<{}>) => {
  const dispatch = useDispatch()

  const disabled = invalid || submitting

  const handleSubmit = (e) => {
    e.preventDefault()

    dispatch(actions.components.debitCard.submitSocialSecurityNumber())
  }

  if (submitting) {
    return (
      <SpinnerWrapper>
        <BlockchainLoader width='80px' height='80px' />
      </SpinnerWrapper>
    )
  }

  return (
    <FlyoutContainer>
      <FlyoutHeader
        data-e2e='socialSecurityNumberHeaderBackHeader'
        onClick={() =>
          dispatch(actions.components.debitCard.setOrderCardStep(OrderCardStep.RESIDENTIAL_ADDRESS))
        }
        mode='back'
      >
        <FormattedMessage
          id='modals.social_security_number.title'
          defaultMessage='Verify Your Identity'
        />
      </FlyoutHeader>
      <FlyoutContent mode='middle'>
        <CustomForm onSubmit={handleSubmit}>
          <FormWrapper flexDirection='column' justifyContent='space-between'>
            <Padding horizontal={40}>
              <FormGroup>
                <FormItem>
                  <Label htmlFor='ssn'>
                    <Text weight={500} size='14px' color='grey900'>
                      <FormattedMessage
                        id='debitcard.social_security_number.ssn'
                        defaultMessage='SSN or Individual Tax ID #'
                      />
                    </Text>
                  </Label>
                  <Field
                    validate={[required, requiredSSN]}
                    placeholder='123456789'
                    name='ssn'
                    errorBottom
                    type='number'
                    component={TextBox}
                  />
                </FormItem>
              </FormGroup>
            </Padding>

            <FlyoutFooter collapsed>
              <Button
                data-e2e='submitSocialSecurityNumber'
                height='48px'
                size='16px'
                nature='primary'
                type='submit'
                fullwidth
                disabled={disabled}
              >
                {submitting ? (
                  <HeartbeatLoader height='16px' width='16px' color='white' />
                ) : (
                  <FormattedMessage id='buttons.next' defaultMessage='Next' />
                )}
              </Button>
            </FlyoutFooter>
          </FormWrapper>
        </CustomForm>
      </FlyoutContent>
    </FlyoutContainer>
  )
}

export default reduxForm<{}>({
  destroyOnUnmount: false,
  form: SOCIAL_SECURITY_NUMBER_FORM
})(SocialSecurityNumber)
