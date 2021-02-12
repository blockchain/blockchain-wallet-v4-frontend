import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import React from 'react'

import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { getData } from './selectors'
import Failure from './template.failure'
import Loading from './template.loading'
import Success from './template.success'

const DepositMethods = props => {
  return props.data.cata({
    Success: val => <Success {...val} {...props} />,
    Failure: () => <Failure {...props} />,
    Loading: () => <Loading />,
    NotAsked: () => <Loading />
  })
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state)
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(DepositMethods)
