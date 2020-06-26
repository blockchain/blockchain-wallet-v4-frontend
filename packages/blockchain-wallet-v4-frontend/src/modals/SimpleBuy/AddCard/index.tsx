import { actions, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import {
  FiatType,
  RemoteDataType,
  SBBuyOrderType,
  SBPaymentMethodsType,
  SBSellOrderType
} from 'core/types'
import { getData } from './selectors'
import { Remote } from 'core'
import { RootState } from 'data/rootReducer'
import { SBAddCardFormValuesType } from 'data/types'
import DataError from 'components/DataError'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

class AddCard extends PureComponent<Props> {
  componentDidMount () {
    if (!Remote.Success.is(this.props.data)) {
      this.props.simpleBuyActions.fetchSBPaymentMethods(this.props.fiatCurrency)
    }
  }

  handleSubmit = () => {
    this.props.simpleBuyActions.addCardDetails()
  }

  render () {
    return this.props.data.cata({
      Success: val => (
        <Success {...this.props} {...val} onSubmit={this.handleSubmit} />
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

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state),
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state) || 'EUR'
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  handleClose: () => void
}
type LinkDispatchPropsType = {
  simpleBuyActions: typeof actions.components.simpleBuy
}
type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
  fiatCurrency: FiatType
}
export type SuccessStateType = {
  formValues?: SBAddCardFormValuesType
  order: SBBuyOrderType | SBSellOrderType | undefined
  paymentMethods: SBPaymentMethodsType
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connect(mapStateToProps, mapDispatchToProps)(AddCard)
