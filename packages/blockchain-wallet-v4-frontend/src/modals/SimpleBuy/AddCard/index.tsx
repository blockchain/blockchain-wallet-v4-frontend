import { actions, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { CoinType, SBPairType } from 'core/types'
import { connect, ConnectedProps } from 'react-redux'
import { CountryType } from 'data/components/identityVerification/types'
import { getData } from './selectors'
import { Remote } from 'core'
import { RootState } from 'data/rootReducer'
import DataError from 'components/DataError'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

class AddCard extends PureComponent<Props> {
  componentDidMount () {
    if (!Remote.Success.is(this.props.data)) {
      this.props.simpleBuyActions.fetchSBPaymentMethods(this.props.fiatCurrency)
      this.props.identityVerificationActions.fetchSupportedCountries()
    }
  }

  handleSubmit = () => {
    this.props.simpleBuyActions.addCardDetails()
  }

  setDefaultCountry = (country: CountryType) => {
    this.props.formActions.change(
      'addCCForm',
      'billingaddress.country',
      country.code
    )

    this.props.formActions.clearFields(
      'addCCForm',
      false,
      false,
      'billingaddress.state'
    )
  }

  onCountryChange = (e, value) => {
    this.props.formActions.change('addCCForm', 'billingaddress.country', value)
    this.props.formActions.clearFields(
      'addCCForm',
      false,
      false,
      'billingaddress.state'
    )
  }

  render () {
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
      Failure: e => (
        <DataError
          message={{ message: e }}
          onClick={this.props.simpleBuyActions.fetchSBPaymentMethods}
        />
      ),
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state) || 'EUR',
  isFirstLogin: selectors.auth.getFirstLogin(state),
  countryCode: selectors.core.settings.getCountryCode(state).getOrElse(null)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  cryptoCurrency?: CoinType
  handleClose: () => void
  pair: SBPairType
}

export type LinkDispatchPropsType = ReturnType<typeof mapDispatchToProps>
export type SuccessStateType = ReturnType<typeof getData>['data']
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connect(mapStateToProps, mapDispatchToProps)(AddCard)
