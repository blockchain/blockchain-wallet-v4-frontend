import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import {
  // EmailHelper,
  FaqFormGroup,
  // FaqFormMessage,
  // FaqHeaderHelper,
  // Footer,
  // IdentityVerificationForm,
  // IdentityVerificationHeader,
  // InputWrapper,
  Label
} from 'components/IdentityVerification'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { FlyoutWrapper } from 'components/Flyout'
import {
  // DateInputBox,
  // EmailVerification,
  // FooterShadowWrapper,
  Form,
  FormItem,
  SelectBox
  // TextBox
} from 'components/Form'
import { map } from 'ramda'

import { Props as OwnProps, SuccessStateType } from '.'

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
const ErrorText = styled(Text)`
  display: inline-flex;
  font-weight: 500;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 32px;
  background-color: ${props => props.theme.red000};
  color: ${props => props.theme.red800};
  margin-bottom: 16px;
`
const getCountryElements = countries => [
  {
    group: '',
    items: map(
      country => ({
        value: country,
        text: country.name
      }),
      countries
    )
  }
]
const Success: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  // console.log('all props here', props)
  // console.log('supportedCountries', props.supportedCountries)
  return (
    <CustomForm onSubmit={props.handleSubmit}>
      <FlyoutWrapper style={{ paddingBottom: '0px', borderBottom: 'grey000' }}>
        <TopText color='grey800' size='20px' weight={600}>
          <LeftTopCol>
            <Icon
              cursor
              data-e2e='sbBackToCryptoSelection'
              name='arrow-left'
              size='20px'
              color='grey600'
              role='button'
              style={{ marginRight: '8px' }}
              onClick={() =>
                props.simpleBuyActions.setStep({
                  step: 'ENTER_AMOUNT',
                  orderType: props.orderType,
                  cryptoCurrency: props.cryptoCurrency,
                  fiatCurrency: props.fiatCurrency || 'USD',
                  pair: props.pair
                })
              }
            />
            <FormattedMessage
              id='modals.simplebuy.info_and_residential.title'
              defaultMessage='Info & Residential Address'
            />
          </LeftTopCol>
          <Icon
            cursor
            data-e2e='sbCloseModalIcon'
            name='close'
            size='20px'
            color='grey600'
            role='button'
            onClick={() => props.handleClose()}
          />
        </TopText>
      </FlyoutWrapper>
      <FlyoutWrapper style={{ paddingTop: '36px' }}>
        {props.error && (
          <ErrorTextContainer>
            <ErrorText>
              <Icon
                name='alert-filled'
                color='red600'
                style={{ marginRight: '4px' }}
              />
              Error: {props.error}
            </ErrorText>
          </ErrorTextContainer>
        )}
        Legal Full Name
        <FaqFormGroup>
          <FormItem>
            <Label htmlFor='country'>
              <FormattedMessage
                id='identityverification.personal.countryrequired'
                defaultMessage='Country *'
              />
            </Label>

            <Field
              data-e2e='selectCountryDropdown'
              name='country'
              // validate={required}
              elements={getCountryElements(props.supportedCountries)}
              component={SelectBox}
              menuPlacement='auto'
              // onChange={onCountrySelect}
              // onChange={() => console.log('country changed')}
              label={
                <FormattedMessage
                  id='components.selectboxcountry.label'
                  defaultMessage='Select country'
                />
              }
            />
          </FormItem>
        </FaqFormGroup>
        <Button
          data-e2e='submitSBInforAndResidential'
          height='48px'
          size='16px'
          nature='primary'
          type='submit'
          fullwidth
          // disabled={disabled}
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
  form: 'simpleBuyInforAndResidential',
  destroyOnUnmount: false
})(Success)
