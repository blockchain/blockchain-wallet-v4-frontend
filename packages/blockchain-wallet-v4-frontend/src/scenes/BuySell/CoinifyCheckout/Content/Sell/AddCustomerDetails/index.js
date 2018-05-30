import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions } from 'data'
import { getData } from './selectors.js'
import Success from './template.success.js'
import Loading from 'components/BuySell/Loading'
class AddCustomerDetailsContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (mediums, account) {
    const { coinifyDataActions } = this.props
    coinifyDataActions.addBankAccount(mediums, account)
  }

  render () {
    return this.props.data.cata({
      Success: (value) => <Success onSubmit={this.onSubmit} {...value} />,
      Failure: (msg) => <div>Failure: {msg.error}</div>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(AddCustomerDetailsContainer)
