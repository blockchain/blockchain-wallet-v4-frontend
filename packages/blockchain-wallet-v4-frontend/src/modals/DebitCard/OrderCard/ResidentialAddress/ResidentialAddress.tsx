import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Padding, PaletteColors, SpinningLoader } from '@blockchain-com/constellation'
import axios from 'axios'
import queryString from 'query-string'
import { path } from 'ramda'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { CountryScope, LocationAddress } from '@core/types'
import {
  BlockchainLoader,
  Box,
  Button,
  HeartbeatLoader,
  Icon,
  Text
} from 'blockchain-info-components'
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
import { ResidentialAddress as ResidentialAddressFormValues } from 'data/components/debitCard/types'
import { RootState } from 'data/rootReducer'
import { CountryType, StateType } from 'data/types'
import { useCountryList, useOpenViewUsPatrioticAct, useRemote, useUSStateList } from 'hooks'
import { countryUsesZipcode, required } from 'services/forms'
import { postCodeExistsForCountry, postCodeValidator } from 'services/postCodeValidator'
import { debounce } from 'utils/helpers'

import AddressItem from '../../../Onboarding/KycVerification/UserAddress/AddressItem'

const { RESIDENTIAL_ADDRESS_FORM } = model.components.debitCard

const MIN_SEARCH_CHARACTERS = 3

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
      value: state.code
    }))
  }
]

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

export const LinkButton = styled(Text)`
  cursor: pointer;
`
const AddressLine = styled(Text)`
  font-weight: 600;
  font-size: 16px;
  color: ${PaletteColors['grey-900']};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 220px;
`
const CountryLine = styled(Text)`
  font-weight: 400;
  font-size: 14px;
  color: ${PaletteColors['grey-700']};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 220px;
`

const EditIconWrapper = styled(Flex)`
  justify-content: center;
  flex-direction: column;
  height: 42px;
`

type Props = {
  handleClose: () => void
}

const ResidentialAddress = ({
  handleClose,
  invalid,
  submitting
}: InjectedFormProps<{}, Props> & Props) => {
  const dispatch = useDispatch()

  const { data: supportedCountries } = useCountryList({ scope: CountryScope.SIGNUP })
  const { data: supportedUSStates } = useUSStateList()
  const { data: residentialAddress, isLoading: isResidentialAddressLoading } = useRemote(
    selectors.components.debitCard.getResidentialAddress
  )
  const nabuToken = useSelector((state: RootState) =>
    selectors.modules.profile.getUserApiToken(state)
  )
  const useLoqateServiceEnabled = useSelector((state: RootState) =>
    selectors.core.walletOptions.useLoqateServiceEnabled(state).getOrElse(false)
  )

  const openViewUsPatrioticAct = useOpenViewUsPatrioticAct()

  const [editAddress, setEditAddress] = useState(false)
  const [isAddressSelected, setIsAddressSelected] = useState(false)
  const [enterAddressManually, setEnterAddressManually] = useState(false)
  const [userStartedSearch, setUserStartedSearch] = useState<boolean>(false)
  const [suggestedAddresses, setSuggestedAddresses] = useState<Array<LocationAddress>>([])
  const [searchText, setSearchText] = useState('')
  const [isAddressLoading, setIsAddressLoading] = useState(false)

  const canSubmitAddress =
    (!isAddressSelected && enterAddressManually) || (isAddressSelected && !enterAddressManually)

  const formValues = useSelector((state: RootState) =>
    selectors.form.getFormValues(RESIDENTIAL_ADDRESS_FORM)(state)
  ) as ResidentialAddressFormValues

  const {
    data: { api }
  } = useSelector(selectors.core.walletOptions.getDomains)

  const disabled =
    invalid || submitting || (!!useLoqateServiceEnabled && !canSubmitAddress && editAddress)

  useEffect(() => {
    dispatch(actions.components.debitCard.getResidentialAddress())
  }, [dispatch])

  useEffect(() => {
    if (residentialAddress) {
      dispatch(actions.form.change(RESIDENTIAL_ADDRESS_FORM, 'country', residentialAddress.country))
      dispatch(actions.form.change(RESIDENTIAL_ADDRESS_FORM, 'state', residentialAddress.state))
      dispatch(actions.form.change(RESIDENTIAL_ADDRESS_FORM, 'city', residentialAddress.city))
      dispatch(actions.form.change(RESIDENTIAL_ADDRESS_FORM, 'line1', residentialAddress.line1))
      dispatch(actions.form.change(RESIDENTIAL_ADDRESS_FORM, 'line2', residentialAddress.line2))
      dispatch(
        actions.form.change(RESIDENTIAL_ADDRESS_FORM, 'postCode', residentialAddress.postCode)
      )
    }
  }, [dispatch, residentialAddress])

  const getStateName = (state: string): string =>
    supportedUSStates?.states.find((usState) => usState.code === state)?.name || ''

  useEffect(() => {
    if (editAddress && residentialAddress) {
      const homeAddress = `${residentialAddress?.line1 ?? ''} ${residentialAddress?.line2 ?? ''} ${
        residentialAddress?.city ?? ''
      }, ${getStateName(residentialAddress?.state ?? '')} ${residentialAddress?.postCode ?? ''}`

      dispatch(actions.form.change(RESIDENTIAL_ADDRESS_FORM, 'homeAddress', homeAddress))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editAddress])

  if (
    submitting ||
    !supportedCountries?.countries ||
    !supportedUSStates?.states ||
    isResidentialAddressLoading
  ) {
    return (
      <SpinnerWrapper>
        <BlockchainLoader width='80px' height='80px' />
      </SpinnerWrapper>
    )
  }

  const onCountryChange = (country: CountryType) => {
    const selectedCountry = supportedCountries.countries.find((c) => c.code === country.code)

    dispatch(actions.form.change(RESIDENTIAL_ADDRESS_FORM, 'country', selectedCountry))

    dispatch(actions.form.clearFields(RESIDENTIAL_ADDRESS_FORM, false, false, 'state'))
  }

  const onStateChange = (state: StateType) => {
    const selectedState = supportedUSStates.states.find((s) => s.code === state.code)

    dispatch(actions.form.change(RESIDENTIAL_ADDRESS_FORM, 'state', selectedState))
  }

  const countryUsesZipOrPostcode =
    countryUsesZipcode(formValues?.country) || postCodeExistsForCountry(formValues?.country)

  const handleSubmit = (e) => {
    e.preventDefault()

    dispatch(actions.components.debitCard.submitResidentialAddress())
  }

  const findUserAddresses = async (text: string, id?: string) => {
    if (!residentialAddress || text.length < MIN_SEARCH_CHARACTERS) {
      return
    }
    if (text.length === 0) {
      setSuggestedAddresses([])
      return
    }
    if (suggestedAddresses.length) {
      setSuggestedAddresses([])
    }
    setIsAddressLoading(true)
    let addresses = []
    const searchQuery = queryString.stringify({
      country_code: residentialAddress.country,
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

  const retrieveUserAddresses = async (id: string) => {
    const response = await axios.get(`${api}/nabu-gateway/address-capture/retrieve?id=${id}`, {
      headers: { authorization: `Bearer ${nabuToken}` }
    })

    if (response.data) {
      const addressDetails = response.data
      dispatch(actions.form.change(RESIDENTIAL_ADDRESS_FORM, 'line1', addressDetails.street))
      dispatch(
        actions.form.change(RESIDENTIAL_ADDRESS_FORM, 'line2', addressDetails.secondaryStreet)
      )
      dispatch(actions.form.change(RESIDENTIAL_ADDRESS_FORM, 'city', addressDetails.city))
      dispatch(actions.form.change(RESIDENTIAL_ADDRESS_FORM, 'postCode', addressDetails.postalCode))
    }
  }

  const resetAddressForm = () => {
    dispatch(actions.form.clearFields(RESIDENTIAL_ADDRESS_FORM, false, false, 'line1'))
    dispatch(actions.form.clearFields(RESIDENTIAL_ADDRESS_FORM, false, false, 'line2'))
    dispatch(actions.form.clearFields(RESIDENTIAL_ADDRESS_FORM, false, false, 'city'))
    dispatch(actions.form.clearFields(RESIDENTIAL_ADDRESS_FORM, false, false, 'postCode'))
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

  const useAddress = (address: LocationAddress) => {
    if (address.type === 'Container') {
      setSearchText(`${searchText} `)
      findUserAddresses(searchText, address.id)
    } else {
      resetAddressForm()
      setIsAddressSelected(true)
      retrieveUserAddresses(address.id)
    }
  }

  const onEditAddress = () => {
    setEditAddress(true)
  }

  return (
    <FlyoutContainer>
      <FlyoutHeader data-e2e='residentialAddressHeader' mode='close' onClick={handleClose}>
        <Text weight={600} size='24px' color='grey900'>
          <FormattedMessage
            id='modals.residential_address.title'
            defaultMessage='Verify Your Address'
          />
        </Text>
      </FlyoutHeader>
      <Padding left={2.5} right={2.5}>
        <Text
          weight={500}
          size='16px'
          color='grey600'
          style={{ marginBottom: '32px', marginTop: '0px' }}
        >
          <FormattedMessage
            id='modals.residential_address.subTitle'
            defaultMessage='Confirm your address below as part of a federal identity requirement.'
          />
        </Text>
      </Padding>
      <FlyoutContent mode='middle'>
        <CustomForm onSubmit={handleSubmit}>
          <FormWrapper flexDirection='column' justifyContent='space-between'>
            {editAddress ? (
              <Padding horizontal={2.5}>
                {useLoqateServiceEnabled && (
                  <FormGroup>
                    <FormItem>
                      <Label htmlFor='homeAddress'>
                        <Text weight={500} size='14px' color='grey900'>
                          <FormattedMessage
                            id='debitcard.residential_address.search_your_address'
                            defaultMessage='Search your address'
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

                {useLoqateServiceEnabled &&
                  editAddress &&
                  !enterAddressManually &&
                  !isAddressSelected &&
                  userStartedSearch && (
                    <LinkButton onClick={() => setEnterAddressManually(true)}>
                      <Text weight={600} size='16px' color='blue600'>
                        <FormattedMessage
                          id='debitcard.residential_address.add_my_address'
                          defaultMessage='Add address manually'
                        />
                      </Text>
                    </LinkButton>
                  )}

                {useLoqateServiceEnabled && isAddressLoading && (
                  <Padding top={0.625}>
                    <SpinningLoader variant='color' size='small' />
                  </Padding>
                )}
                {useLoqateServiceEnabled &&
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

                {(isAddressSelected || enterAddressManually || searchText === '') && (
                  <>
                    <FormGroup>
                      <FormItem>
                        <Label htmlFor='line1'>
                          <Text weight={500} size='14px' color='grey900'>
                            {formValues?.country === 'US' ? (
                              <FormattedMessage
                                id='debitcard.residential_address.address_line1required'
                                defaultMessage='Address Line 1 *'
                              />
                            ) : (
                              <FormattedMessage
                                id='debitcard.residential_address.streetline1required'
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
                            {formValues?.country === 'US' ? (
                              <FormattedMessage
                                id='debitcard.residential_address.address_line2_optional'
                                defaultMessage='Address Line 2 (optional)'
                              />
                            ) : (
                              <FormattedMessage
                                id='debitcard.residential_address.streetline2'
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
                              id='debitcard.residential_address.cityrequired'
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
                          {formValues?.country === 'US' ? (
                            <FormattedMessage
                              id='debitcard.residential_address.staterequired'
                              defaultMessage='State *'
                            />
                          ) : (
                            <FormattedMessage
                              id='debitcard.residential_address.region'
                              defaultMessage='Region'
                            />
                          )}
                        </FormLabel>
                        {formValues?.country === 'US' ? (
                          <Field
                            name='state'
                            // @ts-ignore
                            elements={getStateElements(supportedUSStates.states)}
                            onChange={(_, value) => onStateChange(value)}
                            component={SelectBox}
                            errorBottom
                            validate={required}
                            disabled
                          />
                        ) : (
                          <Field
                            name='state'
                            component={TextBox}
                            errorBottom
                            countryCode={formValues?.country}
                          />
                        )}
                      </FormItem>
                      {countryUsesZipOrPostcode && (
                        <FormItem>
                          <FormLabel htmlFor='postCode'>
                            <Text weight={500} size='14px' color='grey900'>
                              {countryUsesZipcode(formValues?.country) ? (
                                <FormattedMessage
                                  id='debitcard.residential_address.zip'
                                  defaultMessage='Zip Code *'
                                />
                              ) : (
                                <FormattedMessage
                                  id='debitcard.residential_address.postCoderequired'
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
                          // @ts-ignore
                          elements={getCountryElements(supportedCountries.countries)}
                          component={SelectBox}
                          menuPlacement='auto'
                          onChange={(_, value) => onCountryChange(value)}
                          label={
                            <FormattedMessage
                              id='components.selectboxcountry.label'
                              defaultMessage='Select country'
                            />
                          }
                          // we shouldn't be able to change the country
                          disabled
                        />
                      </FormItem>
                    </FormGroup>
                  </>
                )}
              </Padding>
            ) : (
              <Padding left={2.5} right={2.5}>
                <FormGroup>
                  <FormItem>
                    <Label htmlFor='homeAddress'>
                      <Text weight={500} size='14px' color='grey900'>
                        <FormattedMessage
                          id='debitcard.residential_address.home_address'
                          defaultMessage='Home Address'
                        />
                      </Text>
                    </Label>
                    <Box
                      data-e2e='userAddress'
                      style={{ alignItems: 'flex-start', marginBottom: '12px' }}
                    >
                      <Flex flexDirection='column'>
                        <AddressLine>
                          {residentialAddress?.line1}
                          {residentialAddress?.line2}
                        </AddressLine>
                        <CountryLine>
                          {`${residentialAddress?.city}, ${getStateName(
                            residentialAddress?.state ?? ''
                          )} ${residentialAddress?.postCode}`}
                        </CountryLine>
                      </Flex>

                      <EditIconWrapper>
                        <Icon
                          cursor
                          data-e2e='btnEditIconButton'
                          name='pencil'
                          onClick={onEditAddress}
                          style={{ marginRight: 10 }}
                        />
                      </EditIconWrapper>
                    </Box>
                  </FormItem>

                  <Text weight={500} size='12px' color='grey600'>
                    <FormattedMessage
                      id='modals.residential_address.disclaimer'
                      defaultMessage='PO Box or commercial address will not be accepted'
                    />
                  </Text>
                </FormGroup>
              </Padding>
            )}

            <FlyoutFooter collapsed>
              <Flex justifyContent='center' flexDirection='row' style={{ paddingBottom: '20px' }}>
                <LinkButton
                  onClick={() => {
                    openViewUsPatrioticAct({ origin: 'VerifyAddress' })
                  }}
                >
                  <Text weight={600} size='16px' color='blue600'>
                    <FormattedMessage
                      id='modals.residential_address.why_do_i_need'
                      defaultMessage='Why Do I Need To Do This'
                    />
                  </Text>
                </LinkButton>
              </Flex>
              <Button
                data-e2e='submitResidentialAddress'
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

export default reduxForm<{}, Props>({
  destroyOnUnmount: false,
  form: RESIDENTIAL_ADDRESS_FORM
})(ResidentialAddress)
