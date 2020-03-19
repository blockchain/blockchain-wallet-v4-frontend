import { actions, selectors } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  CurrenciesType,
  RemoteDataType,
  SBSuggestedAmountType
} from 'core/types'
import { getData } from './selectors'
import { Props as OwnProps } from '../template.success'
import { RootState } from 'data/rootReducer'
import { UserDataType } from 'data/types'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

export type SuccessStateType = {
  suggestedAmounts: SBSuggestedAmountType
  userData: UserDataType
}
type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
  fiatCurrency: undefined | keyof CurrenciesType
}
export type LinkDispatchPropsType = {
  identityVerificationActions: typeof actions.components.identityVerification
  profileActions: typeof actions.modules.profile
}
export type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType
class Checkout extends PureComponent<Props> {
  state = {}

  componentDidMount () {
    this.props.simpleBuyActions.initializeCheckout(this.props.pairs)
  }

  componentWillUnmount () {
    this.props.simpleBuyActions.destroyCheckout()
  }

  handleSubmit = () => {
    // if the user is < tier 2 go to kyc but save order info
    // if the user is tier 2 try to submit order, let BE fail
    const { userData } = this.props.data.getOrElse({
      userData: { tiers: { current: 0 } }
    })

    if (userData.tiers.current < 2) {
      this.props.identityVerificationActions.verifyIdentity(2)
    } else {
      this.props.simpleBuyActions.createSBOrder()
    }
  }

  render () {
    return this.props.data.cata({
      Success: val => (
        <Success {...this.props} {...val} onSubmit={this.handleSubmit} />
      ),
      Failure: e => <div>Oops. Something went wrong.</div>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state),
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state)
})

const mapDispatchToProps = dispatch => ({
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  profileActions: bindActionCreators(actions.modules.profile, dispatch)
})

const enhance = connect(
  mapStateToProps,
  mapDispatchToProps
)

export default enhance(Checkout)
