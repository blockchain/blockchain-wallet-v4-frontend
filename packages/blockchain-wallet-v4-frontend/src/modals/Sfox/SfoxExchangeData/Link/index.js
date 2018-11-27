import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import { merge, path, append, prop, head } from 'ramda'

import Link from './template'
import { actions, selectors } from 'data'
import { Remote } from 'blockchain-wallet-v4/src'

class LinkContainer extends Component {
  state = {
    enablePlaid: false,
    id: '',
    microDeposits: false,
    microStep: 'welcome',
    isToggled: false,
    selectBank: false
  }

  componentDidMount () {
    let receiveMessage = e => {
      const plaidWhitelist = ['enablePlaid', 'disablePlaid', 'getBankAccounts']
      if (!e.data.command) return
      if (e.data.from !== 'plaid') return
      if (e.data.to !== 'exchange') return
      if (e.origin !== this.props.plaidBaseUrl) return
      if (plaidWhitelist.indexOf(e.data.command) < 0) return

      if (e.data.command === 'enablePlaid') this.setState({ enablePlaid: true })
      if (e.data.command === 'disablePlaid') {
        this.setState({ enablePlaid: false })
      }
      if (e.data.command === 'getBankAccounts' && e.data.msg) {
        this.props.sfoxDataActions.getBankAccounts(e.data.msg)
        this.setState({
          enablePlaid: false,
          token: e.data.msg,
          selectBank: true
        })
      }
    }
    window.addEventListener('message', receiveMessage, false)
  }

  componentWillUnmount () {
    this.props.sfoxDataActions.wipeBankAccounts()
  }

  resetAccountHolder = () => {
    this.props.formActions.reset('sfoxLink')
    this.props.sfoxFrontendActions.sfoxNotAsked()
  }

  onSetBankAccount = data => {
    const bankChoice = merge(data, { token: this.state.token })
    this.props.sfoxFrontendActions.setBankAccount(bankChoice)
  }

  submitMicroDeposits = () => {
    const amount1 = parseFloat(this.props.deposit1)
    const amount2 = parseFloat(this.props.deposit2)
    this.props.sfoxFrontendActions.submitMicroDeposits({ amount1, amount2 })
  }

  onSubmit = () => {
    const {
      fullName,
      routingNumber,
      accountNumber,
      accountType,
      toggleManual
    } = this.state
    if (toggleManual && routingNumber && accountNumber) {
      this.props.sfoxFrontendActions.sfoxLoading()
      this.props.sfoxFrontendActions.setBankManually(
        routingNumber,
        accountNumber,
        fullName,
        accountType
      )
    } else {
      this.props.sfoxFrontendActions.sfoxLoading()
      const bankChoice = merge(
        {
          id: this.state.id,
          firstname: this.props.accountHolderFirst,
          lastname: this.props.accountHolderLast
        },
        { token: this.state.token }
      )
      this.props.sfoxFrontendActions.setBankAccount(bankChoice)
    }
  }

  render () {
    const {
      bankAccounts,
      accounts,
      linkStatus,
      sfoxFrontendActions,
      plaidBaseUrl,
      plaidPath,
      plaidEnv
    } = this.props
    const {
      microDeposits,
      microStep,
      enablePlaid,
      selectBank,
      isToggled
    } = this.state

    const { sfoxNotAsked } = sfoxFrontendActions
    const plaidUrl = `${plaidBaseUrl}/wallet-helper/plaid/#/key/${plaidPath}/env/${plaidEnv}`
    const { showModal } = this.props.modalActions

    let awaitingDeposits = false
    if (Remote.Success.is(accounts)) {
      awaitingDeposits =
        prop('status', head(accounts.getOrElse())) === 'pending'
    }

    const { sfoxBusy, err } = linkStatus.cata({
      Success: () => ({ sfoxBusy: false }),
      Loading: () => ({ sfoxBusy: true }),
      Failure: err => ({ sfoxBusy: false, err }),
      NotAsked: () => ({ sfoxBusy: false })
    })

    return (
      <Link
        onSubmit={this.onSubmit}
        plaidUrl={plaidUrl}
        bankAccounts={bankAccounts}
        accounts={accounts}
        onSetBankAccount={this.onSetBankAccount}
        toggleManual={() =>
          this.setState({ toggleManual: !this.state.toggleManual })
        }
        handleBankSelection={id => this.setState({ id })}
        onNameChange={name => this.setState({ holderName: name })}
        handleFullName={e => this.setState({ fullName: e.target.value })}
        handleRoutingNumber={e =>
          this.setState({ routingNumber: e.target.value })
        }
        handleAccountNumber={e =>
          this.setState({ accountNumber: e.target.value })
        }
        handleAccountType={(e, val) => this.setState({ accountType: val })}
        goToMicroDepositStep={step => this.setState({ microStep: step })}
        submitMicroDeposits={this.submitMicroDeposits}
        awaitingDeposits={awaitingDeposits}
        showModal={showModal}
        busy={sfoxBusy}
        setNotAsked={sfoxNotAsked}
        linkError={err && path(['message'], err)}
        resetAccountHolder={this.resetAccountHolder}
        microDeposits={microDeposits}
        microStep={microStep}
        enablePlaid={enablePlaid}
        selectBank={selectBank}
        isToggled={isToggled}
      />
    )
  }
}

const basePath = [
  'walletOptionsPath',
  'data',
  'platforms',
  'web',
  'sfox',
  'config'
]
const plaidPath = append('plaid', basePath)
const plaidEnvPath = append('plaidEnv', basePath)

const mapStateToProps = state => ({
  plaidPath: path(plaidPath, state),
  plaidEnv: path(plaidEnvPath, state),
  plaidBaseUrl: path(
    ['walletOptionsPath', 'data', 'domains', 'walletHelper'],
    state
  ),
  bankAccounts: selectors.core.data.sfox.getBankAccounts(state),
  accounts: selectors.core.data.sfox.getAccounts(state),
  deposit1: formValueSelector('sfoxLink')(state, 'deposit1'),
  deposit2: formValueSelector('sfoxLink')(state, 'deposit2'),
  accountHolderFirst: formValueSelector('sfoxLink')(
    state,
    'accountHolderFirst'
  ),
  accountHolderLast: formValueSelector('sfoxLink')(state, 'accountHolderLast'),
  linkStatus: path(['sfoxSignup', 'sfoxBusy'], state)
})

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch),
  sfoxDataActions: bindActionCreators(actions.core.data.sfox, dispatch),
  sfoxFrontendActions: bindActionCreators(actions.modules.sfox, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LinkContainer)
