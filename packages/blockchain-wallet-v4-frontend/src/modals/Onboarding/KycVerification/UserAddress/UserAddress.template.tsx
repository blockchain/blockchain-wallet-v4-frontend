import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Flex, SpinningLoader } from '@blockchain-com/constellation'
import { path } from 'ramda'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'

import { CountryScope, LocationAddress, RetrieveAddress } from '@core/types'
import { BlockchainLoader, Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import {
  FlyoutContainer,
  FlyoutContent,
  FlyoutFooter,
  FlyoutHeader
} from 'components/Flyout/Layout'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import FormLabel from 'components/Form/FormLabel'
import SelectBox from 'components/Form/SelectBox'
import TextBox from 'components/Form/TextBox'
import { actions, model, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { CountryType, StateType } from 'data/types'
import { useCountryList, useRemote, useUSStateList } from 'hooks'
import { countryUsesZipcode, required } from 'services/forms'
import { postCodeExistsForCountry, postCodeValidator } from 'services/postCodeValidator'
import { debounce } from 'utils/helpers'

import AddressItem from './AddressItem'
import { Props as OwnProps, SuccessStateType } from './UserAddress'
import {
  ContentWrapper,
  CustomForm,
  ErrorText,
  Label,
  LinkButton,
  SpinnerWrapper
} from './UserAddress.model'

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

const { RESIDENTIAL_FORM } = model.components.identityVerification

const getCountryElements = (countries: Array<CountryType>) => [
  {
    group: '',
    items: countries.map((country: CountryType) => ({
      text: country.name,
      value: country.code
    }))
  }
]

const getStateElements = (states: Array<StateType>) => [
  {
    group: '',
    items: states.map((state: StateType) => ({
      text: state.name,
      value: state
    }))
  }
]

const Success: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => {
  const { data: supportedCountries } = useCountryList({ scope: CountryScope.SIGNUP })
  const { data: supportedUSStates } = useUSStateList()
  const { data: userAddresses, isLoading } = useRemote(
    selectors.components.identityVerification.getUserAddresses
  )
  const userRetrievedAddress = useSelector(
    selectors.components.identityVerification.getUserRetrieveAddress
  )
  const useLoqateServiceEnabled = useSelector((state: RootState) =>
    selectors.core.walletOptions.useLoqateServiceEnabled(state).getOrElse(false)
  )
  const [isCountryStateSet, setCountyStateSet] = useState(false)
  const [isAddressSelected, setIsAddressSelected] = useState(false)
  const [enterAddressManually, setEnterAddressManually] = useState(false)
  const [searchText, setSearchText] = useState('')
  const dispatch = useDispatch()

  const canSubmitAddress =
    (!isAddressSelected && enterAddressManually) || (isAddressSelected && !enterAddressManually)

  const disabled =
    props.invalid || props.submitting || (!!useLoqateServiceEnabled && !canSubmitAddress)

  useEffect(() => {
    if (userRetrievedAddress && userRetrievedAddress.data?.city) {
      const { data: userSelectedAddress } = userRetrievedAddress

      if (userSelectedAddress) {
        setTimeout(() => {
          props.updateSelectedAddressDetails(userSelectedAddress)
        }, 200)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRetrievedAddress])

  if (props.submitting || !supportedCountries?.countries || !supportedUSStates?.states) {
    return (
      <SpinnerWrapper>
        <BlockchainLoader width='80px' height='80px' />
      </SpinnerWrapper>
    )
  }

  let countryCode =
    (props.formValues && props.formValues.country && props.formValues.country.code) ||
    props.countryCode

  let stateCode = (props.formValues && props.formValues.state) || props.usState

  if (props.userData?.country && props.userData.country !== countryCode) {
    countryCode = props.userData.country
  }

  if (props.userData?.state && props.userData.state !== stateCode) {
    stateCode = props.userData.state
  }

  const countryIsUS = countryCode === 'US'
  const countryUsesZipOrPostcode =
    countryUsesZipcode(countryCode) || postCodeExistsForCountry(countryCode)

  const defaultCountry = supportedCountries.countries.find(
    (country) => country.code === countryCode
  )

  const findUserAddresses = (text: string, id?: string) => {
    if (text.length < 3) {
      return
    }
    dispatch(actions.components.identityVerification.fetchUserAddress({ countryCode, id, text }))
  }

  const findUserAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value
    if (text === '') return

    if (isAddressSelected) {
      setIsAddressSelected(false)
    }
    setSearchText(text)
    findUserAddresses(text)
  }

  if (defaultCountry && (!props.formValues || (props.formValues && !props.formValues.country))) {
    props.updateDefaultCountry(defaultCountry.code)
  }

  if (countryIsUS && props.userData?.state && !isCountryStateSet) {
    const defaultState = supportedUSStates.states.find((state) => state.code === stateCode)
    if (defaultState) {
      setTimeout(() => {
        props.updateDefaultState(defaultState)
        setCountyStateSet(true)
      }, 500)
    }
  }

  const useAddress = (address: LocationAddress) => {
    if (address.type === 'Container') {
      setSearchText(`${searchText} `)
      findUserAddresses(searchText, address.id)
    } else {
      setIsAddressSelected(true)
      props.resetAddressDetails()
      dispatch(actions.components.identityVerification.retrieveUserAddress({ id: address.id }))
    }
  }

  return (
    <FlyoutContainer>
      <CustomForm onSubmit={props.handleSubmit}>
        <FlyoutHeader data-e2e='userInfoDetailsCloseIcon' mode='back' onClick={props.onClose}>
          <FormattedMessage
            id='modals.simplebuy.user_address.title'
            defaultMessage='Residential Address'
          />
        </FlyoutHeader>

        <FlyoutContent mode='top'>
          <ContentWrapper>
            {props.error && (
              <Flex justifyContent='center'>
                <ErrorText>
                  <Icon name='alert-filled' color='red600' style={{ marginRight: '4px' }} />
                  Error: {props.error}
                </ErrorText>
              </Flex>
            )}

            {useLoqateServiceEnabled && (
              <FormGroup>
                <FormItem>
                  <Label htmlFor='homeAddress'>
                    <Text weight={500} size='14px' color='grey900'>
                      <FormattedMessage
                        id='identityverification.user_address.home_address'
                        defaultMessage='Home Address'
                      />
                    </Text>
                  </Label>
                  <Field
                    name='homeAddress'
                    placeholder='Start typing to find your home address'
                    component={TextBox}
                    onChange={debounce(findUserAddress, 400)}
                  />
                </FormItem>
              </FormGroup>
            )}

            {useLoqateServiceEnabled && !isAddressSelected && !enterAddressManually && (
              <LinkButton onClick={() => setEnterAddressManually(true)}>
                <Text weight={600} size='16px' color='blue600'>
                  <FormattedMessage
                    id='identityverification.add_my_address'
                    defaultMessage='Add My Address'
                  />
                </Text>
              </LinkButton>
            )}

            {useLoqateServiceEnabled && isLoading && (
              <SpinningLoader variant='color' size='small' />
            )}

            {useLoqateServiceEnabled &&
              !isAddressSelected &&
              !enterAddressManually &&
              userAddresses &&
              userAddresses?.addresses?.length > 0 &&
              userAddresses?.addresses.map((address) => (
                <AddressItem
                  address={address}
                  key={address.id}
                  handleClick={useAddress}
                  searchText={searchText}
                />
              ))}

            {(!useLoqateServiceEnabled || isAddressSelected || enterAddressManually) && (
              <>
                <FormGroup>
                  <FormItem>
                    <Label htmlFor='line1'>
                      <Text weight={500} size='14px' color='grey900'>
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
                      </Text>
                    </Label>
                    <Field name='line1' errorBottom validate={required} component={TextBox} />
                  </FormItem>
                </FormGroup>

                <FormGroup>
                  <FormItem>
                    <Label htmlFor='line2'>
                      <Text weight={500} size='14px' color='grey900'>
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
                      </Text>
                    </Label>
                    <Field name='line2' errorBottom component={TextBox} />
                  </FormItem>
                </FormGroup>

                <FormGroup>
                  <FormItem>
                    <Label htmlFor='city'>
                      <Text weight={500} size='14px' color='grey900'>
                        <FormattedMessage
                          id='identityverification.personal.cityrequired'
                          defaultMessage='City *'
                        />
                      </Text>
                    </Label>
                    <Field name='city' errorBottom validate={required} component={TextBox} />
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
                        name='state'
                        elements={getStateElements(supportedUSStates.states)}
                        component={SelectBox}
                        errorBottom
                        validate={[required]}
                        disabled={!!stateCode}
                      />
                    ) : (
                      <Field
                        name='state'
                        component={TextBox}
                        errorBottom
                        countryCode={countryCode}
                      />
                    )}
                  </FormItem>
                  {countryUsesZipOrPostcode && (
                    <FormItem>
                      <FormLabel htmlFor='postCode'>
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
                        name='postCode'
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
                      name='country'
                      validate={required}
                      elements={getCountryElements(supportedCountries.countries)}
                      component={SelectBox}
                      menuPlacement='auto'
                      onChange={props.onCountrySelect}
                      disabled={!!countryCode}
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
          </ContentWrapper>
        </FlyoutContent>

        <FlyoutFooter collapsed>
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

export type Props = OwnProps &
  SuccessStateType & {
    onCountrySelect: (e, value: CountryType) => void
    resetAddressDetails: () => void
    updateDefaultCountry: (country: string) => void
    updateDefaultState: (state: StateType) => void
    updateSelectedAddressDetails: (addressDetails: RetrieveAddress) => void
  }

export default reduxForm<{}, Props>({
  destroyOnUnmount: false,
  form: RESIDENTIAL_FORM
})(Success)
