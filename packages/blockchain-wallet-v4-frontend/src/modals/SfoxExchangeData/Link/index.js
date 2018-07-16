import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import ui from 'redux-ui'
import Link from './template'
import { actions, selectors } from 'data'
import { formValueSelector } from 'redux-form'
import { merge, path, append, prop, head } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'

class LinkContainer extends Component {
  constructor(props) {
    super(props)
    this.onSetBankAccount = this.onSetBankAccount.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.submitMicroDeposits = this.submitMicroDeposits.bind(this)

    this.state = { enablePlaid: false, id: '' }
  }

  componentDidMount() {
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
        this.setState({ enablePlaid: false, token: e.data.msg })
        this.props.updateUI({ selectBank: true })
      }
    }
    window.addEventListener('message', receiveMessage, false)
  }

  componentDidUpdate() {
    if (
      Remote.Success.is(this.props.bankAccounts) &&
      Remote.Loading.is(this.props.linkStatus)
    ) {
      this.props.sfoxFrontendActions.sfoxSuccess()
    }
  }

  componentWillUnmount() {
    this.props.updateUI({
      toggleManual: false,
      selectBank: false,
      microDeposits: false,
      microStep: 'welcome',
      busy: false
    })
    this.props.sfoxDataActions.wipeBankAccounts()
  }

  onSetBankAccount(data) {
    const bankChoice = merge(data, { token: this.state.token })
    this.props.sfoxFrontendActions.setBankAccount(bankChoice)
  }

  submitMicroDeposits() {
    const amount1 = parseFloat(this.props.deposit1)
    const amount2 = parseFloat(this.props.deposit2)
    this.props.sfoxFrontendActions.submitMicroDeposits({ amount1, amount2 })
  }

  onSubmit() {
    if (
      this.props.ui.toggleManual &&
      this.state.routingNumber &&
      this.state.accountNumber
    ) {
      this.props.updateUI({ busy: true })
      const { fullName, routingNumber, accountNumber, accountType } = this.state
      this.props.sfoxFrontendActions.setBankManually(
        routingNumber,
        accountNumber,
        fullName,
        accountType
      )
    } else {
      this.props.updateUI({ busy: true })
      const bankChoice = merge(
        { id: this.state.id, name: this.state.holderName },
        { token: this.state.token }
      )
      this.props.sfoxFrontendActions.setBankAccount(bankChoice)
    }
  }

  render() {
    const {
      bankAccounts,
      accounts,
      ui,
      linkStatus,
      sfoxFrontendActions
    } = this.props
    const { plaidBaseUrl, plaidPath, plaidEnv } = this.props
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
        enablePlaid={this.state.enablePlaid}
        bankAccounts={bankAccounts}
        accounts={accounts}
        onSetBankAccount={this.onSetBankAccount}
        toggleManual={() =>
          this.props.updateUI({ toggleManual: !ui.toggleManual })
        }
        ui={ui}
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
        microStep={ui.microStep}
        goToMicroDepositStep={step => this.props.updateUI({ microStep: step })}
        submitMicroDeposits={this.submitMicroDeposits}
        awaitingDeposits={awaitingDeposits}
        showModal={showModal}
        busy={sfoxBusy}
        setNotAsked={sfoxNotAsked}
        linkError={err && path(['message'], err)}
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
  linkStatus: path(['sfoxSignup', 'sfoxBusy'], state)
})

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch),
  sfoxDataActions: bindActionCreators(actions.core.data.sfox, dispatch),
  sfoxFrontendActions: bindActionCreators(actions.modules.sfox, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  ui({
    state: {
      toggleManual: false,
      selectBank: false,
      microDeposits: false,
      microStep: 'welcome',
      busy: false
    }
  })
)

export default enhance(LinkContainer)
