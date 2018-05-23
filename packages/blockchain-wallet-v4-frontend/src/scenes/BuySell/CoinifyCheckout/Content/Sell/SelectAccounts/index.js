import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions } from 'data'
import { getData } from './selectors.js'
import Success from './template.success.js'
import Loading from '../../../../template.loading'

class SelectAccountsContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.deleteBankAccount = this.deleteBankAccount.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (e) {
    e.preventDefault()
    // TODO: Store form data in the state
  }

  deleteBankAccount (bankAccount) {
    console.log(bankAccount)
    this.props.coinifyActions.deleteBankAccount(bankAccount)
  }

  render () {
    const { data } = this.props
    return data.cata({
      Success: (value) =>
        <Success
          onSubmit={this.onSubmit}
          deleteBankAccount={this.deleteBankAccount}
          {...value} />,
      Failure: (message) => <div>Failure: {message.error}</div>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  coinifyActions: bindActionCreators(actions.modules.coinify, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectAccountsContainer)
