import { actions, model, selectors } from 'data'
import { bindActionCreators } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { CountryType } from 'data/components/identityVerification/types'
import { ExtractSuccess, RemoteDataType } from 'core/types'
import { getData } from './selectors'
import { RootState } from 'data/rootReducer'
import { SBInfoAndResidentialFormValuesType } from 'data/types'
import DataError from 'components/DataError'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

const { INFO_AND_RESIDENTIAL_FORM } = model.components.identityVerification

class InfoAndResidential extends PureComponent<Props> {
  componentDidMount () {
    this.fetchData()
  }

  fetchData = () => {
    this.props.identityVerificationActions.fetchSupportedCountries()
    this.props.identityVerificationActions.fetchStates()
  }

  handleSubmit = () => {
    this.props.identityVerificationActions.saveInfoAndResidentialData(
      this.props.metadata
    )
  }

  onCountryChange = (e, value) => {
    e.preventDefault()
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

  render () {
    // const { countryData, userData, ...rest } = this.props
    return this.props.data.cata({
      Success: val => (
        <Success
          {...this.props}
          {...val}
          onSubmit={this.handleSubmit}
          onCountrySelect={this.onCountryChange}
          updateDefaultCountry={this.setDefaultCountry}
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
    | SBInfoAndResidentialFormValuesType
    | undefined,
  countryCode: selectors.core.settings.getCountryCode(state).getOrElse(null)
})

const mapDispatchToProps = dispatch => ({
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  metadata: any
  onClose: () => void
}

export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>

export type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
}

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(InfoAndResidential)
