import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from 'blockchain-wallet-v4/src'
import { CoinType, SBPairType } from 'blockchain-wallet-v4/src/types'
import DataError from 'components/DataError'
import { actions, selectors } from 'data'
import { CountryType } from 'data/components/identityVerification/types'
import { RootState } from 'data/rootReducer'

import Loading from '../template.loading'
import { getData } from './selectors'
import Success from './template.success'

class AddCard extends PureComponent<Props> {
  componentDidMount() {
    this.props.simpleBuyActions.fetchSBPaymentMethods(this.props.fiatCurrency)

    if (!Remote.Success.is(this.props.data)) {
      this.props.identityVerificationActions.fetchSupportedCountries()
    }
  }

  handleSubmit = () => {
    this.props.simpleBuyActions.addCardDetails()
  }

  setDefaultCountry = (country: CountryType) => {
    this.props.formActions.change('addCCForm', 'billingaddress.country', country)
    this.props.formActions.clearFields('addCCForm', false, false, 'billingaddress.state')
  }

  onCountryChange = (e, value) => {
    this.setDefaultCountry(value)
  }

  render() {
    return this.props.data.cata({
      Failure: (e) => (
        <DataError
          message={{ message: e }}
          onClick={this.props.simpleBuyActions.fetchSBPaymentMethods}
        />
      ),
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (val) => (
        <Success
          {...this.props}
          {...val}
          isSddFlow={val.userData?.tiers?.current !== 2}
          onSubmit={this.handleSubmit}
          onCountrySelect={this.onCountryChange}
          updateDefaultCountry={this.setDefaultCountry}
        />
      )
    })
  }
}

const mapStateToProps = (state: RootState) => ({
  countryCode: selectors.core.settings.getCountryCode(state).getOrElse(null),
  data: getData(state),
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state) || 'EUR'
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
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
