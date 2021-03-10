import React, { FunctionComponent, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { map } from 'ramda'
import { Field, Form, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Icon, Image, Link, Text } from 'blockchain-info-components'
import { SBBuyOrderType, SBSellOrderType } from 'blockchain-wallet-v4/src/types'
import { ErrorCartridge } from 'components/Cartridge'
import { FlyoutWrapper } from 'components/Flyout'
import {
  CheckBox,
  CreditCardBox,
  CreditCardCVCBox,
  CreditCardExpiryBox,
  FormGroup,
  FormItem,
  FormLabel,
  SelectBox,
  SelectBoxUSState,
  TextBox
} from 'components/Form'
import {
  normalizeCreditCard,
  validateCreditCard
} from 'components/Form/CreditCardBox'
import {
  DEFAULT_SECURITY_CODE_NAME,
  getCardTypeByValue
} from 'components/Form/CreditCardBox/model'
import {
  normalizeCreditCardCVC,
  validateCreditCardCVC
} from 'components/Form/CreditCardCVCBox'
import {
  normalizeCreditCardExpiry,
  validateCreditCardExpiry
} from 'components/Form/CreditCardExpiryBox'
import { CountryType } from 'data/components/identityVerification/types'
import { SBAddCardErrorType } from 'data/types'
import {
  countryUsesPostalcode,
  countryUsesZipcode,
  required,
  requiredZipCode
} from 'services/forms'

import { Props as OwnProps, SuccessStateType } from '.'
import { Error } from './model'

const CustomFlyoutWrapper = styled(FlyoutWrapper)`
  height: 100%;
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`

const CardContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 24px 0;
  > img {
    margin-right: 8px;
  }
`
export const Label = styled.label`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  display: block;
  color: ${props => props.theme.grey900};
`
export const CaptionContainer = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: row;
  justify-content: center;
`
export const CheckBoxContainer = styled.div`
  margin: 24px 0;
  display: flex;
  flex-direction: column;
`
export const Caption = styled(Text)`
  font-weight: 500;
  font-size: 12px;
  line-height: 150%;
  color: ${props => props.theme.grey600};
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

const getCountryCode = country => {
  if (country.code) {
    return country.code
  }
  return country
}

const Success: React.FC<InjectedFormProps<{}, Props, ErrorType> &
  Props> = props => {
  const [billingAddress, setBillingAddress] = useState(false)

  const countryCode =
    (props.formValues &&
      props.formValues?.billingaddress?.country &&
      getCountryCode(props.formValues.billingaddress.country)) ||
    props.countryCode

  const countryIsUS = countryCode === 'US'
  const countryUsesZipOrPostcode =
    countryUsesZipcode(countryCode) || countryUsesPostalcode(countryCode)

  const defaultCountry = props.supportedCountries.find(
    country => country.code === countryCode
  )

  if (
    defaultCountry &&
    (!props.formValues ||
      (props.formValues &&
        props.formValues.billingaddress &&
        props.formValues.billingaddress.country))
  ) {
    props.updateDefaultCountry(defaultCountry)
  }

  useEffect(() => {
    props.formActions.change('addCCForm', 'sameAsBillingAddress', true)
  }, [])

  return (
    <CustomFlyoutWrapper>
      <TopText color='grey800' size='20px' weight={600}>
        <Icon
          cursor
          name='arrow-back'
          size='20px'
          color='grey600'
          role='button'
          style={{ marginRight: '24px' }}
          onClick={() =>
            props.order
              ? props.simpleBuyActions.setStep({
                  step: 'CHECKOUT_CONFIRM',
                  order: props.order as SBSellOrderType | SBBuyOrderType
                })
              : props.simpleBuyActions.setStep({
                  fiatCurrency: props.fiatCurrency,
                  step: 'PAYMENT_METHODS',
                  pair: props.pair,
                  cryptoCurrency: props.cryptoCurrency || 'BTC',
                  order: props.order
                })
          }
        />
        <FormattedMessage id='buttons.add_card' defaultMessage='Add Card' />
      </TopText>

      {props.isSddFlow && (
        <div>
          <Text weight={500} size='16px' color='grey600'>
            <FormattedMessage
              id='modals.simplebuy.add_card.description'
              defaultMessage='Securely add your card to fund your crypto purchases. We accept Visa or Mastercard.'
            />
          </Text>
          <CardContainer>
            <Image name='visa-new-logo' />
            <Image name='mastercard-logo' />
          </CardContainer>
        </div>
      )}

      <Form onSubmit={props.handleSubmit}>
        <FormGroup margin='24px'>
          <FormLabel>
            <FormattedMessage
              id='modals.simplebuy.name_on_card'
              defaultMessage='Name on Card'
            />
          </FormLabel>
          <Field
            name='name-on-card'
            component={TextBox}
            validate={[required]}
          />
        </FormGroup>
        <FormGroup margin='24px'>
          <FormLabel>
            <FormattedMessage
              id='modals.simplebuy.card_number'
              defaultMessage='Card Number'
            />
          </FormLabel>
          <Field
            name='card-number'
            component={CreditCardBox}
            normalize={normalizeCreditCard}
            validate={[required, validateCreditCard]}
            {...props}
          />
        </FormGroup>
        <FormGroup inline margin='24px'>
          <FormItem>
            <FormLabel>
              <FormattedMessage
                id='modals.simplebuy.expiry_date'
                defaultMessage='Expiry Date'
              />
            </FormLabel>
            <Field
              name='expiry-date'
              placeholder='MM/YY'
              component={CreditCardExpiryBox as FunctionComponent}
              normalize={normalizeCreditCardExpiry}
              validate={[required, validateCreditCardExpiry]}
            />
          </FormItem>
          <FormItem>
            <FormLabel>
              {(props.formValues &&
                getCardTypeByValue(props.formValues['card-number'])
                  ?.securityCodeName) ||
                DEFAULT_SECURITY_CODE_NAME}
            </FormLabel>
            <Field
              name='cvc'
              component={CreditCardCVCBox as FunctionComponent}
              normalize={normalizeCreditCardCVC}
              validate={[required, validateCreditCardCVC]}
            />
          </FormItem>
        </FormGroup>
        {props.error && (
          <FormGroup>
            <ErrorCartridge>
              <Icon
                name='alert-filled'
                color='red600'
                style={{ marginRight: '4px' }}
              />
              <Error error={props.error} />
            </ErrorCartridge>
          </FormGroup>
        )}
        {!props.isSddFlow && (
          <FormGroup margin='24px'>
            <Link
              size='13px'
              style={{
                textAlign: 'center',
                width: '100%'
              }}
              onClick={() =>
                props.simpleBuyActions.setStep({ step: 'CC_BILLING_ADDRESS' })
              }
            >
              <FormattedMessage
                id='modals.simplebuy.change_billing_address'
                defaultMessage='Change Billing Address'
              />
            </Link>
          </FormGroup>
        )}

        {props.isSddFlow && (
          <>
            <FormItem>
              <CheckBoxContainer>
                <Text
                  weight={600}
                  size='14px'
                  color='grey800'
                  lineHeight='150%'
                  style={{ marginBottom: '16px' }}
                >
                  <FormattedMessage
                    id='modals.simplebuy.add_card.billing_address'
                    defaultMessage='Billing Address'
                  />
                </Text>
                <Field
                  name='sameAsBillingAddress'
                  id='sameAsBillingAddress'
                  component={CheckBox}
                  type='checkbox'
                  onChange={() =>
                    setBillingAddress(billingAddress => !billingAddress)
                  }
                >
                  <Text weight={500} size='14px'>
                    <FormattedMessage
                      id='modals.simplebuy.add_card.residential_address'
                      defaultMessage='Same as Residential Address'
                    />
                  </Text>
                </Field>
              </CheckBoxContainer>
            </FormItem>
            {billingAddress && (
              <>
                <FormGroup>
                  <FormItem>
                    <Label htmlFor='line1'>
                      <Text weight={500} size='14px' color='grey900'>
                        <FormattedMessage
                          id='modals.simplebuy.info_and_residential.address_line1'
                          defaultMessage='Address Line 1'
                        />
                      </Text>
                    </Label>
                    <Field
                      name='billingaddress.line1'
                      errorBottom
                      validate={required}
                      component={TextBox}
                    />
                  </FormItem>
                </FormGroup>

                <FormGroup>
                  <FormItem>
                    <Label htmlFor='line2'>
                      <Text weight={500} size='14px' color='grey900'>
                        <FormattedMessage
                          id='identityverification.personal.address_line2'
                          defaultMessage='Address Line 2'
                        />
                      </Text>
                    </Label>
                    <Field
                      name='billingaddress.line2'
                      errorBottom
                      component={TextBox}
                    />
                  </FormItem>
                </FormGroup>

                <FormGroup>
                  <FormItem>
                    <Label htmlFor='city'>
                      <Text weight={500} size='14px' color='grey900'>
                        <FormattedMessage
                          id='modals.simplebuy.info_and_residential.city'
                          defaultMessage='City'
                        />
                      </Text>
                    </Label>
                    <Field
                      name='billingaddress.city'
                      errorBottom
                      validate={required}
                      component={TextBox}
                    />
                  </FormItem>
                </FormGroup>
                <FormGroup inline>
                  <FormItem>
                    <FormLabel>
                      {countryIsUS ? (
                        <FormattedMessage
                          id='identityverification.personal.staterequired'
                          defaultMessage='State *'
                        />
                      ) : (
                        <FormattedMessage
                          id='identityverification.personal.region'
                          defaultMessage='Region'
                        />
                      )}
                    </FormLabel>
                    {countryIsUS ? (
                      <Field
                        name='billingaddress.state'
                        component={SelectBoxUSState}
                        errorBottom
                        validate={[required]}
                        normalize={val => val && val.code}
                      />
                    ) : (
                      <Field name='state' component={TextBox} />
                    )}
                  </FormItem>
                  {countryUsesZipOrPostcode && (
                    <FormItem>
                      <FormLabel htmlFor='billingaddress.postCode'>
                        <Text weight={500} size='14px' color='grey900'>
                          {countryUsesZipcode(countryCode) ? (
                            <FormattedMessage
                              id='identityverification.personal.zip'
                              defaultMessage='Zip Code *'
                            />
                          ) : (
                            <FormattedMessage
                              id='identityverification.personal.postcoderequired'
                              defaultMessage='Postcode *'
                            />
                          )}
                        </Text>
                      </FormLabel>
                      <Field
                        name='billingaddress.postCode'
                        errorBottom
                        validate={requiredZipCode}
                        component={TextBox}
                      />
                    </FormItem>
                  )}
                </FormGroup>

                <FormGroup>
                  <FormItem>
                    <Label htmlFor='country'>
                      <Text weight={500} size='14px' color='grey900'>
                        <FormattedMessage
                          id='modals.simplebuy.info_and_residential.country'
                          defaultMessage='Country'
                        />
                      </Text>
                    </Label>

                    <Field
                      data-e2e='selectCountryDropdown'
                      name='billingaddress.country'
                      validate={required}
                      elements={getCountryElements(props.supportedCountries)}
                      component={SelectBox}
                      menuPlacement='auto'
                      onChange={props.onCountrySelect}
                      label={
                        <FormattedMessage
                          id='components.selectboxcountry.label'
                          defaultMessage='Select country'
                        />
                      }
                    />
                  </FormItem>
                </FormGroup>
              </>
            )}
          </>
        )}
        <FormGroup>
          <Button
            nature='primary'
            data-e2e='addCardEnter'
            height='48px'
            size='16px'
            type='submit'
            disabled={props.invalid || props.submitting}
          >
            <FormattedMessage id='buttons.next' defaultMessage='Next' />
          </Button>

          <CaptionContainer>
            <Icon name='lock' />
            <Caption>
              <FormattedMessage
                id='modals.simplebuy.add_card.pricacy_disclaimer'
                defaultMessage='Privacy protected with 256-Bit SSL encryption.'
              />
            </Caption>
          </CaptionContainer>
        </FormGroup>
      </Form>
    </CustomFlyoutWrapper>
  )
}

export type Props = OwnProps &
  SuccessStateType & {
    onCountrySelect: (e, value) => void
    updateDefaultCountry: (country: CountryType) => void
  } & { isSddFlow: boolean }

export type ErrorType = SBAddCardErrorType

export default reduxForm<{}, Props, ErrorType>({
  form: 'addCCForm',
  destroyOnUnmount: false
})(Success)
