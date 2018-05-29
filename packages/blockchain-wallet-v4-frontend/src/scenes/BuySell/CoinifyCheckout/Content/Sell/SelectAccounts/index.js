import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { prop } from 'ramda'

import { actions } from 'data'
import { getData } from './selectors.js'
import Success from './template.success.js'
import Loading from '../../../../template.loading'

class SelectAccountsContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.setBankAccount = this.setBankAccount.bind(this)
    this.deleteBankAccount = this.deleteBankAccount.bind(this)
  }

  setBankAccount (bankAccount) {
    this.props.coinifyDataActions.setBankAccount(bankAccount)
  }

  deleteBankAccount (bankAccount) {
    this.props.modalActions.showModal('CoinifyDeleteBank', { bankAccount })
  }

  render () {
    const { data, radioButtonSelected } = this.props
    return data.cata({
      Success: (value) =>
        <Success
          setBankAccount={() => this.setBankAccount(prop(radioButtonSelected, value.bankAccounts))}
          deleteBankAccount={this.deleteBankAccount}
          radioButtonSelected={radioButtonSelected}
          {...value} />,
      Failure: (message) => <div>Failure: {message.error}</div>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state) => getData(state)

const mapDispatchToProps = (dispatch) => ({
  coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectAccountsContainer)
