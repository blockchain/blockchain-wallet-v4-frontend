import { actions, model, selectors } from 'data'
import { bindActionCreators } from 'redux'
import {
  CoinType,
  ExtractSuccess,
  FiatType,
  RemoteDataType,
  SBOrderActionType,
  SBOrderType,
  SBPairType,
  SBPaymentMethodType
} from 'core/types'
import { connect, ConnectedProps } from 'react-redux'
import { CountryType } from 'data/components/identityVerification/types'
import { getData } from './selectors'
import { RootState } from 'data/rootReducer'
import { SBInfoAndResidentialFormValuesType } from 'data/types'
import DataError from 'components/DataError'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

const { INFO_AND_RESIDENTIAL } = model.components.simpleBuy

class InfoAndResidential extends PureComponent<Props> {
  componentDidMount () {
    this.props.identityVerificationActions.fetchSupportedCountries()
    this.props.identityVerificationActions.fetchStates()
  }
  fetchData = () => {
    this.props.identityVerificationActions.fetchSupportedCountries()
    this.props.identityVerificationActions.fetchStates()
  }

  handleSubmit = () => {
    this.props.simpleBuyActions.saveInfoAndResidentialData()
  }

  onCountryChange = (e, value) => {
    this.props.formActions.change(INFO_AND_RESIDENTIAL, 'country', value)
    this.props.formActions.clearFields(
      INFO_AND_RESIDENTIAL,
      false,
      false,
      'state'
    )
  }

  setDefaultCountry = (country: CountryType) => {
    this.props.formActions.change(INFO_AND_RESIDENTIAL, 'country', country)
    this.props.formActions.clearFields(
      INFO_AND_RESIDENTIAL,
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
  cryptoCurrency:
    selectors.components.simpleBuy.getCryptoCurrency(state) || 'BTC',
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state),
  formValues: selectors.form.getFormValues(INFO_AND_RESIDENTIAL)(state) as
    | SBInfoAndResidentialFormValuesType
    | undefined,
  goals: selectors.goals.getGoals(state),
  preferences: selectors.preferences.getSBCheckoutPreferences(state),
  isFirstLogin: selectors.auth.getFirstLogin(state),
  countryCode: selectors.core.settings.getCountryCode(state).getOrElse(null)
})

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  deleteGoal: (id: string) => dispatch(actions.goals.deleteGoal(id)),
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  formActions: bindActionCreators(actions.form, dispatch),
  profileActions: bindActionCreators(actions.modules.profile, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
  method?: SBPaymentMethodType
  order?: SBOrderType
  orderType: SBOrderActionType
  pair: SBPairType
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type LinkStatePropsType = {
  cryptoCurrency: CoinType
  data: RemoteDataType<string, SuccessStateType>
  fiatCurrency: undefined | FiatType
  pair: SBPairType
}
export type LinkDispatchPropsType = ReturnType<typeof mapDispatchToProps>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(InfoAndResidential)
