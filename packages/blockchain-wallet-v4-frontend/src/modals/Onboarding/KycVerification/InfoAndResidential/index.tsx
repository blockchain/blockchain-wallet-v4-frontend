import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import DataError from 'components/DataError'
import { actions, model, selectors } from 'data'
import { CountryType } from 'data/components/identityVerification/types'
import { RootState } from 'data/rootReducer'
import { InfoAndResidentialFormValuesType } from 'data/types'

import Loading from '../template.loading'
import { getData } from './selectors'
import Success from './template.success'

const { INFO_AND_RESIDENTIAL_FORM } = model.components.identityVerification

class InfoAndResidential extends PureComponent<Props> {
  componentDidMount() {
    this.fetchData()

    this.props.analyticsActions.logEvent([
      'INFO_AND_RESIDENTIAL',
      JSON.stringify({
        countryCode: this.props.countryCode,
        infoAndResidential: 'page init'
      })
    ])
  }

  fetchData = () => {
    this.props.identityVerificationActions.fetchSupportedCountries()
    this.props.identityVerificationActions.fetchStates()
  }

  handleSubmit = () => {
    const {
      checkSddEligibility,
      identityVerificationActions,
      onCompletionCallback
    } = this.props
    identityVerificationActions.saveInfoAndResidentialData(
      checkSddEligibility,
      onCompletionCallback
    )
    this.props.analyticsActions.logEvent([
      'INFO_AND_RESIDENTIAL',
      JSON.stringify({
        countryCode: this.props.countryCode,
        infoAndResidential: 'page submit'
      })
    ])
  }

  onCountryChange = (e, value) => {
    this.setDefaultCountry(value)
  }

  setDefaultCountry = (country: CountryType) => {
    this.props.formActions.change(INFO_AND_RESIDENTIAL_FORM, 'country', country)
    this.props.formActions.clearFields(
      INFO_AND_RESIDENTIAL_FORM,
      false,
      false,
      'state'
    )
  }

  render() {
    return this.props.data.cata({
      Success: val => (
        <Success
          {...this.props}
          {...val}
          onSubmit={this.handleSubmit}
          onCountrySelect={this.onCountryChange}
          updateDefaultCountry={this.setDefaultCountry}
          initialValues={{
            ...val.userData
          }}
        />
      ),
      Failure: () => <DataError onClick={this.fetchData} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  formValues: selectors.form.getFormValues(INFO_AND_RESIDENTIAL_FORM)(state) as
    | InfoAndResidentialFormValuesType
    | undefined,
  countryCode: selectors.core.settings.getCountryCode(state).getOrElse(null)
})

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  checkSddEligibility?: boolean
  onClose: () => void
  onCompletionCallback?: () => void
}

export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(InfoAndResidential)
