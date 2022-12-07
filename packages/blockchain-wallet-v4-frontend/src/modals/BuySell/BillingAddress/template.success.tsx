import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Padding, SpinningLoader } from '@blockchain-com/constellation'
import axios from 'axios'
import queryString from 'query-string'
import { path } from 'ramda'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { LocationAddress } from '@core/types'
import { Button, Text } from 'blockchain-info-components'
import { Divider } from 'components/Divider'
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
import FormLabel from 'components/Form/FormLabel'
import SelectBox from 'components/Form/SelectBox'
import TextBox from 'components/Form/TextBox'
import { actions, model, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { StateType } from 'data/types'
import { useUSStateList } from 'hooks'
import { countryUsesZipcode, required } from 'services/forms'
import { postCodeExistsForCountry, postCodeValidator } from 'services/postCodeValidator'
import { debounce } from 'utils/helpers'

import AddressItem from '../../Onboarding/KycVerification/UserAddress/AddressItem'
import { Props as OwnProps, SuccessStateType } from '.'
import CountrySelect from './CountrySelect'

const MIN_SEARCH_CHARACTERS = 3

const { FORMS_BS_BILLING_ADDRESS } = model.components.buySell

const requiredZipCode = (value, allVals) => {
  const countryCode = (path(['country', 'code'], allVals) || path(['country'], allVals)) as string
  if (!postCodeExistsForCountry(countryCode)) return undefined
  if (!value)
    return (
      <div data-e2e='requiredMessage'>
        <FormattedMessage id='formhelper.required' defaultMessage='Required' />
      </div>
    )

  return postCodeValidator(countryCode, value) === true ? undefined : (
    <FormattedMessage id='formhelper.requiredzipcode' defaultMessage='Invalid zipcode' />
  )
}

const CustomForm = styled(Form)`
  height: 100%;
`

const FormWrapper = styled(Flex)`
  height: 100%;
`

const CentralContent = styled(FormWrapper)`
  padding: 8px 40px 0px;
  flex-direction: column;
  overflow: auto;
`

export const LinkButton = styled(Text)`
  cursor: pointer;
`

export type Props = OwnProps & SuccessStateType

const Success: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => {
  const dispatch = useDispatch()
  const { data: supportedUSStates } = useUSStateList()
  const [isAddressSelected, setIsAddressSelected] = useState(false)
  const [enterAddressManually, setEnterAddressManually] = useState(false)
  const [userStartedSearch, setUserStartedSearch] = useState<boolean>(false)
  const [suggestedAddresses, setSuggestedAddresses] = useState<Array<LocationAddress>>([])
  const [searchText, setSearchText] = useState('')
  const [isAddressLoading, setIsAddressLoading] = useState(false)
  const {
    data: { api }
  } = useSelector(selectors.core.walletOptions.getDomains)

  const nabuToken = useSelector((state: RootState) =>
    selectors.modules.profile.getUserApiToken(state)
  )

  if (!props.formValues || !supportedUSStates?.states) return null

  const getStateElements = (states: Array<StateType>) => [
    {
      group: '',
      items: states.map((state: StateType) => ({
        text: state.name,
        value: state.code
      }))
    }
  ]

  const countryCode = props.formValues.country
  const countryIsUS = countryCode === 'US'
  const countryUsesZipOrPostcode =
    countryUsesZipcode(countryCode) || postCodeExistsForCountry(countryCode)

  const findUserAddresses = async (text: string, id?: string) => {
    if (text.length === 0) {
      setSuggestedAddresses([])
      return
    }

    if (text.length < MIN_SEARCH_CHARACTERS) {
      return
    }

    setIsAddressLoading(true)

    let addresses = []
    const searchQuery = queryString.stringify({
      country_code: countryCode,
      id,
      text
    })
    const response = await axios.get(`${api}/nabu-gateway/address-capture/find?${searchQuery}`, {
      headers: { authorization: `Bearer ${nabuToken}` }
    })

    if (response.data) {
      addresses = response.data?.addresses
    }

    setSuggestedAddresses(addresses)
    setIsAddressLoading(false)
  }

  const findUserAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value
    if (text === '') return
    setSearchText(text)
    findUserAddresses(text)
    setUserStartedSearch(true)
    if (isAddressSelected) {
      setIsAddressSelected(false)
    }
  }

  const retrieveUserAddresses = async (id: string) => {
    const response = await axios.get(`${api}/nabu-gateway/address-capture/retrieve?id=${id}`, {
      headers: { authorization: `Bearer ${nabuToken}` }
    })

    if (response.data) {
      const addressDetails = response.data
      dispatch(actions.form.change(FORMS_BS_BILLING_ADDRESS, 'line1', addressDetails.street))
      dispatch(
        actions.form.change(FORMS_BS_BILLING_ADDRESS, 'line2', addressDetails.secondaryStreet)
      )
      dispatch(actions.form.change(FORMS_BS_BILLING_ADDRESS, 'city', addressDetails.city))
      dispatch(actions.form.change(FORMS_BS_BILLING_ADDRESS, 'postCode', addressDetails.postalCode))
    }
  }

  const resetAddressForm = () => {
    dispatch(actions.form.clearFields(FORMS_BS_BILLING_ADDRESS, false, false, 'line1'))
    dispatch(actions.form.clearFields(FORMS_BS_BILLING_ADDRESS, false, false, 'line2'))
    dispatch(actions.form.clearFields(FORMS_BS_BILLING_ADDRESS, false, false, 'city'))
    dispatch(actions.form.clearFields(FORMS_BS_BILLING_ADDRESS, false, false, 'postCode'))
  }

  const useAddress = (address: LocationAddress) => {
    if (address.type === 'Container') {
      setSearchText(`${searchText} `)
      findUserAddresses(searchText, address.id)
    } else {
      resetAddressForm()
      setIsAddressSelected(true)
      retrieveUserAddresses(address.id)
      setUserStartedSearch(false)
    }
  }

  const onEnterAddressManually = () => {
    setEnterAddressManually(true)
    dispatch(actions.form.clearFields(FORMS_BS_BILLING_ADDRESS, false, false, 'homeAddress'))
  }

  return (
    <FlyoutContainer>
      <FlyoutHeader
        data-e2e='residentialAddressHeader'
        mode='back'
        onClick={() =>
          props.buySellActions.setStep({
            step: 'DETERMINE_CARD_PROVIDER'
          })
        }
      >
        <Text weight={600} size='24px' color='grey900'>
          <FormattedMessage
            id='modals.simplebuy.billing_address'
            defaultMessage='Billing Address'
          />
        </Text>
      </FlyoutHeader>
      <FlyoutContent mode='middle'>
        <CustomForm onSubmit={props.handleSubmit}>
          <FormWrapper flexDirection='column'>
            <Padding horizontal={2.5}>
              <CountrySelect {...props} />
            </Padding>
            <Divider />
            <CentralContent>
              {props.useLoqateServiceEnabled && (
                <FormGroup>
                  <FormItem>
                    <FormLabel htmlFor='homeAddress'>
                      <Text weight={500} size='14px' color='grey900'>
                        <FormattedMessage
                          id='debitcard.residential_address.search_your_address'
                          defaultMessage='Search your address'
                        />
                      </Text>
                    </FormLabel>
                    <Field
                      name='homeAddress'
                      placeholder='Start typing to find your home address'
                      component={TextBox}
                      onChange={debounce(findUserAddress, 400)}
                    />
                  </FormItem>
                </FormGroup>
              )}

              {props.useLoqateServiceEnabled &&
                !enterAddressManually &&
                userStartedSearch &&
                !isAddressSelected && (
                  <LinkButton onClick={onEnterAddressManually}>
                    <Text weight={600} size='16px' color='blue600'>
                      <FormattedMessage
                        id='debitcard.residential_address.add_my_address'
                        defaultMessage='Add address manually'
                      />
                    </Text>
                  </LinkButton>
                )}

              {props.useLoqateServiceEnabled && isAddressLoading && (
                <Padding top={0.625}>
                  <SpinningLoader variant='color' size='small' />
                </Padding>
              )}

              {props.useLoqateServiceEnabled &&
                !isAddressSelected &&
                !enterAddressManually &&
                suggestedAddresses &&
                suggestedAddresses.length > 0 &&
                suggestedAddresses.map((address) => (
                  <AddressItem
                    address={address}
                    key={address.id}
                    handleClick={useAddress}
                    searchText={searchText}
                  />
                ))}

              {(!userStartedSearch || enterAddressManually) && (
                <>
                  <FormGroup margin='24px'>
                    <FormLabel>
                      {countryIsUS ? (
                        <FormattedMessage
                          id='identityverification.personal.address_line1required'
                          defaultMessage='Address Line 1 *'
                        />
                      ) : (
                        <FormattedMessage
                          id='identityverification.personal.streetline1required'
                          defaultMessage='Street Line 1 *'
                        />
                      )}
                    </FormLabel>
                    <Field name='line1' validate={required} component={TextBox} />
                  </FormGroup>
                  <FormGroup margin='24px'>
                    <FormLabel>
                      {countryIsUS ? (
                        <FormattedMessage
                          id='identityverification.personal.address_line2_optional'
                          defaultMessage='Address Line 2 (optional)'
                        />
                      ) : (
                        <FormattedMessage
                          id='identityverification.personal.streetline2'
                          defaultMessage='Street Line 2'
                        />
                      )}
                    </FormLabel>
                    <Field name='line2' component={TextBox} />
                  </FormGroup>
                  <FormGroup margin='24px'>
                    <FormLabel>
                      <FormattedMessage
                        id='identityverification.personal.cityrequired'
                        defaultMessage='City *'
                      />
                    </FormLabel>
                    <Field name='city' validate={required} component={TextBox} />
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
                          name='state'
                          elements={getStateElements(supportedUSStates.states)}
                          component={SelectBox}
                          validate={[required]}
                        />
                      ) : (
                        <Field name='state' component={TextBox} />
                      )}
                    </FormItem>
                    {countryUsesZipOrPostcode && (
                      <FormItem>
                        <FormLabel htmlFor='postCode'>
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
                        </FormLabel>
                        <Field name='postCode' validate={requiredZipCode} component={TextBox} />
                      </FormItem>
                    )}
                  </FormGroup>
                </>
              )}
            </CentralContent>
            <FlyoutFooter collapsed>
              <Button
                fullwidth
                type='submit'
                data-e2e='udpateBillingAddr'
                nature='primary'
                height='48px'
                size='16px'
              >
                <FormattedMessage
                  id='modals.simplebuy.save_billing_address'
                  defaultMessage='Save Billing Address'
                />
              </Button>
            </FlyoutFooter>
          </FormWrapper>
        </CustomForm>
      </FlyoutContent>
    </FlyoutContainer>
  )
}

export default reduxForm<{}, Props>({
  destroyOnUnmount: false,
  form: FORMS_BS_BILLING_ADDRESS
})(Success)
