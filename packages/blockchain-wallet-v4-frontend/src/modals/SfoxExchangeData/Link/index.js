import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import ui from 'redux-ui'
import Link from './template'
import { actions, selectors } from 'data'

import { merge } from 'ramda'

class LinkContainer extends Component {
  constructor (props) {
    super(props)
    this.onSetBankAccount = this.onSetBankAccount.bind(this)
    this.toggleManual = this.toggleManual.bind(this)
    this.setBankManually = this.setBankManually.bind(this)
    this.state = { enablePlaid: false }
  }

  componentDidMount () {
    let receiveMessage = (e) => {
      const plaidWhitelist = ['enablePlaid', 'disablePlaid', 'getBankAccounts']
      if (!e.data.command) return
      if (e.data.from !== 'plaid') return
      if (e.data.to !== 'exchange') return
      if (e.origin !== `http://localhost:8081`) return // TODO: get from wallet options
      if (plaidWhitelist.indexOf(e.data.command) < 0) return

      if (e.data.command === 'enablePlaid') this.setState({ enablePlaid: true })
      if (e.data.command === 'disablePlaid') this.setState({ enablePlaid: false })
      if (e.data.command === 'getBankAccounts' && e.data.msg) {
        this.props.sfoxDataActions.getBankAccounts(e.data.msg)
        this.setState({ enablePlaid: false, token: e.data.msg })
      }
    }
    window.addEventListener('message', receiveMessage, false)
  }

  onSetBankAccount (data) {
    const bankChoice = merge(data, {token: this.state.token})
    this.props.sfoxFrontendActions.setBankAccount(bankChoice)
  }

  toggleManual () {
    this.props.updateUI({ toggleManual: !this.props.ui.toggleManual })
  }

  setBankManually (routing, account, name, type) {
    this.props.sfoxFrontendActions.setBankManually(routing, account, name, type)
  }

  render () {
    const { plaidUrl, bankAccounts, ui } = this.props
    return <Link
      handleSubmit={this.handleSubmit}
      plaidUrl={plaidUrl}
      enablePlaid={this.state.enablePlaid}
      bankAccounts={bankAccounts}
      onSetBankAccount={this.onSetBankAccount}
      toggleManual={this.toggleManual}
      setBankManually={this.setBankManually}
      ui={ui}
    />
  }
}

const mapStateToProps = (state) => ({
  plaidUrl: 'http://localhost:8081/wallet-helper/plaid/#/key/0b041cd9e9fbf1e7d93a0d5a39f5b9/env/production', // TODO: get from wallet options
  bankAccounts: selectors.core.data.sfox.getBankAccounts(state)
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  sfoxDataActions: bindActionCreators(actions.core.data.sfox, dispatch),
  sfoxFrontendActions: bindActionCreators(actions.modules.sfox, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { toggleManual: false } })
)

export default enhance(LinkContainer)
