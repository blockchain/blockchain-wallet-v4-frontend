import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { RetrieveAddress } from '@core/types'
import DataError from 'components/DataError'
import { actions, model, selectors } from 'data'
import { StateType } from 'data/components/identityVerification/types'
import { RootState } from 'data/rootReducer'
import { Analytics, InfoAndResidentialFormValuesType } from 'data/types'

import Loading from '../template.loading'
import { getData } from './selectors'
import Success from './UserAddress.template'

const { RESIDENTIAL_FORM } = model.components.identityVerification

const UserAddress = (props: Props) => {
  useEffect(() => {
    if (props.hasCowboysTag) {
      props.analyticsActions.trackEvent({
        key: Analytics.COWBOYS_PERSONAL_INFO_VIEWED,
        properties: {}
      })
      props.analyticsActions.trackEvent({
        key: Analytics.COWBOYS_ADDRESS_VIEWED,
        properties: {}
      })
    }
  }, [])

  const handleSubmit = () => {
    const { analyticsActions, identityVerificationActions } = props

    identityVerificationActions.saveUserResidentialData()

    analyticsActions.trackEvent({
      key: Analytics.ONBOARDING_PERSONAL_INFORMATION_ENTERED,
      properties: {
        origin: 'SETTINGS'
      }
    })
  }

  const setDefaultCountry = (country: string) => {
    props.formActions.change(RESIDENTIAL_FORM, 'country', country)
    props.formActions.clearFields(RESIDENTIAL_FORM, false, false, 'state')
  }

  const setDefaultState = (state: StateType) => {
    props.formActions.change(RESIDENTIAL_FORM, 'state', state)
  }

  const onCountryChange = (e, value) => {
    setDefaultCountry(value)
  }

  const updateSelectedAddressDetails = (addressDetails: RetrieveAddress) => {
    props.formActions.change(RESIDENTIAL_FORM, 'line1', addressDetails.street)
    props.formActions.change(RESIDENTIAL_FORM, 'line2', addressDetails.secondaryStreet)
    props.formActions.change(RESIDENTIAL_FORM, 'city', addressDetails.city)
    props.formActions.change(RESIDENTIAL_FORM, 'postCode', addressDetails.postalCode)
  }

  const resetAddressDetails = () => {
    props.formActions.clearFields(RESIDENTIAL_FORM, false, false, 'line1')
    props.formActions.clearFields(RESIDENTIAL_FORM, false, false, 'line2')
    props.formActions.clearFields(RESIDENTIAL_FORM, false, false, 'city')
    props.formActions.clearFields(RESIDENTIAL_FORM, false, false, 'postCode')
  }

  return props.data.cata({
    Failure: () => <DataError />,
    Loading: () => <Loading />,
    NotAsked: () => <Loading />,
    Success: (val) => (
      <Success
        {...props}
        {...val}
        onSubmit={handleSubmit}
        onCountrySelect={onCountryChange}
        updateDefaultCountry={setDefaultCountry}
        updateDefaultState={setDefaultState}
        updateSelectedAddressDetails={updateSelectedAddressDetails}
        resetAddressDetails={resetAddressDetails}
        initialValues={{
          ...val.userData
        }}
      />
    )
  })
}

const mapStateToProps = (state: RootState) => ({
  countryCode: selectors.core.settings.getCountryCode(state).getOrElse(null),
  data: getData(state),
  formValues: selectors.form.getFormValues(RESIDENTIAL_FORM)(state) as
    | InfoAndResidentialFormValuesType
    | undefined,
  hasCowboysTag: selectors.modules.profile.getCowboysTag(state).getOrElse(false),
  usState: selectors.core.settings.getUsState(state).getOrElse(null)
})

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  identityVerificationActions: bindActionCreators(actions.components.identityVerification, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  onClose: () => void
}

export type SuccessStateType = ReturnType<typeof getData>['data']

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(UserAddress)
