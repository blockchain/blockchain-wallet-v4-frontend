import { actions, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
import { RootState } from 'data/rootReducer'
import Failure from './template.failure'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

class EnterAmount extends PureComponent<Props> {
  componentDidMount () {
    if (this.props.fiatCurrency) {
      this.props.simpleBuyActions.fetchSBPairs(this.props.fiatCurrency)
      this.props.simpleBuyActions.fetchSBFiatEligible(this.props.fiatCurrency)
      this.props.simpleBuyActions.fetchSBPaymentMethods(this.props.fiatCurrency)
      this.props.simpleBuyActions.fetchSBCards()
    }
  }

  render () {
    return this.props.data.cata({
      Success: val => <Success {...val} {...this.props} />,
      Failure: () => <Failure {...this.props} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state)
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
}
export type LinkDispatchPropsType = ReturnType<typeof mapDispatchToProps>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(EnterAmount)
