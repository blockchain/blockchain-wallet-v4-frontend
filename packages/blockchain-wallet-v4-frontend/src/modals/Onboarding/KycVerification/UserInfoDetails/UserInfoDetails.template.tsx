import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { Padding } from '@blockchain-com/constellation'
// @ts-ignore
import { defaultTo } from 'ramda'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'

import { CountryScope } from '@core/types'
import { BlockchainLoader, Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import {
  FlyoutContainer,
  FlyoutContent,
  FlyoutFooter,
  FlyoutHeader
} from 'components/Flyout/Layout'
import DateInputBox from 'components/Form/DateInputBox'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import TextBox from 'components/Form/TextBox'
import { actions, model } from 'data'
import { useCountryList, useUSStateList } from 'hooks'
import { ageOverEighteen, required, requiredDOB } from 'services/forms'

import { Props as OwnProps, SuccessStateType } from './UserInfoDetails'
import {
  Caption,
  CaptionContainer,
  ContentWrapper,
  CustomForm,
  ErrorText,
  ErrorTextContainer,
  Label,
  SpinnerWrapper
} from './UserInfoDetails.model'

const { USER_INFO_DETAILS } = model.components.identityVerification

const addTrailingZero = (text: string) => (text.length >= 2 ? text : `0${text}`)

const removeTrailingZero = (text: string) => text.replace(/^0/, '')

const objectToDOB = ({ date = '', month = '', year = '' }) =>
  `${year}-${month}-${addTrailingZero(date)}`

const DOBToObject = (value) => {
  const [year = '', month = '', date = ''] = defaultTo('', value).split('-')
  return {
    date: removeTrailingZero(date),
    month,
    year
  }
}

const Success: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => {
  const dispatch = useDispatch()
  const { data: supportedCountries } = useCountryList({ scope: CountryScope.SIGNUP })
  const { data: supportedUSStates } = useUSStateList()

  const disabled = props.invalid || props.submitting

  if (props.submitting || !supportedCountries?.countries || !supportedUSStates?.states) {
    return (
      <SpinnerWrapper>
        <BlockchainLoader width='80px' height='80px' />
      </SpinnerWrapper>
    )
  }

  let countryCode = props?.formValues?.country?.code ?? props.countryCode

  let stateCode = (props.formValues && props.formValues.state) || props.usState

  if (props.userData?.country && props.userData.country !== countryCode) {
    countryCode = props.userData.country
  }

  if (props.userData?.state && props.userData.state !== stateCode) {
    stateCode = props.userData.state
  }

  const countryIsUS = countryCode === 'US'

  const checkValidity = () => {
    if (props.formValues?.firstName && props.formValues?.lastName) {
      dispatch(
        actions.components.identityVerification.checkIsNameValid({
          firstName: props.formValues.firstName,
          lastName: props.formValues.lastName
        })
      )
    }
  }

  return (
    <FlyoutContainer>
      <CustomForm onSubmit={props.handleSubmit}>
        <FlyoutHeader data-e2e='userInfoDetailsCloseIcon' mode='back' onClick={props.onClose}>
          <FormattedMessage
            id='modals.simplebuy.user_info_details.title'
            defaultMessage='Name & DOB'
          />
        </FlyoutHeader>

        <FlyoutContent mode='top'>
          <ContentWrapper>
            <FormGroup inline>
              <FormItem>
                <Label htmlFor='firstName'>
                  <Text weight={500} size='14px' color='grey900'>
                    <FormattedMessage
                      id='identityverification.personal.firstnamerequired'
                      defaultMessage='Legal First Name *'
                    />
                  </Text>
                </Label>
                <Field
                  date-e2e='firstName'
                  name='firstName'
                  validate={required}
                  component={TextBox}
                  onBlur={checkValidity}
                  errorBottom
                />
              </FormItem>
              <FormItem>
                <Label htmlFor='lastName'>
                  <Text weight={500} size='14px' color='grey900'>
                    <FormattedMessage
                      id='identityverification.personal.lastnamerequired'
                      defaultMessage='Legal Last Name *'
                    />
                  </Text>
                </Label>
                <Field
                  date-e2e='lastName'
                  name='lastName'
                  validate={required}
                  component={TextBox}
                  onBlur={checkValidity}
                  errorBottom
                />
              </FormItem>
            </FormGroup>
            <FormGroup>
              <Caption variant='body'>
                <FormattedMessage
                  id='modals.simplebuy.info_and_residential.id_or_password'
                  defaultMessage='As shown on your government issued ID or Passport'
                />
              </Caption>
            </FormGroup>
            <FormGroup>
              <FormItem>
                <Label htmlFor='dob'>
                  <Text weight={500} size='14px' color='grey900'>
                    <FormattedMessage
                      id='identityverification.personal.dateofbirthrequired'
                      defaultMessage='Date of Birth *'
                    />
                  </Text>
                </Label>
                <Field
                  name='dob'
                  validate={[requiredDOB, ageOverEighteen]}
                  component={DateInputBox}
                  fullwidth
                  label
                  errorBottom
                  countryIsUS={countryIsUS}
                  parse={objectToDOB}
                  format={DOBToObject}
                />
              </FormItem>

              <CaptionContainer>
                <Icon name='info' style={{ marginRight: '2px' }} />
                <Caption variant='body'>
                  <FormattedMessage
                    id='modals.simplebuy.info_and_residential.dob_caption'
                    defaultMessage='You must be 18 years of age or older to Buy Crypto.'
                  />
                </Caption>
              </CaptionContainer>
            </FormGroup>
          </ContentWrapper>
        </FlyoutContent>

        <FlyoutFooter collapsed>
          {props.error && (
            <Padding top={2.5} bottom={2.5}>
              <ErrorTextContainer>
                <ErrorText>
                  <Icon name='alert-filled' color='red600' style={{ marginRight: '4px' }} />
                  {props.error === 'INVALID_NAMES' ? (
                    <FormattedMessage
                      id='identityverification.person.invalid_name'
                      defaultMessage='Make sure your name and last name are correct'
                    />
                  ) : (
                    props.error
                  )}
                </ErrorText>
              </ErrorTextContainer>
            </Padding>
          )}
          <Button
            data-e2e='submitUserInfoDetails'
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
        </FlyoutFooter>
      </CustomForm>
    </FlyoutContainer>
  )
}

export type Props = OwnProps & SuccessStateType

export default reduxForm<{}, Props>({
  destroyOnUnmount: false,
  form: USER_INFO_DETAILS
})(Success)
