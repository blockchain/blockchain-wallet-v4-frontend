import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Link from './template'
import { actions } from 'data'
import { merge, path, prop, head } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
import { getData } from './selectors'

class LinkContainer extends PureComponent {
  state = {
    enablePlaid: false,
    id: '',
    addBankManually: false,
    selectBank: false,
    microDeposits: false,
    microStep: 'welcome'
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
    this.setState({
      addBankManually: false,
      selectBank: false,
      microDeposits: false,
      microStep: 'welcome'
    })
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
    if (
      this.state.addBankManually &&
      this.state.routingNumber &&
      this.state.accountNumber
    ) {
      this.props.sfoxFrontendActions.sfoxLoading()
      const { fullName, routingNumber, accountNumber, accountType } = this.state
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
      sfoxFrontendActions,
      modalActions,
      accounts,
      bankAccounts,
      busyStatus,
      plaidBaseUrl,
      plaidKey,
      plaidEnv
    } = this.props
    const { sfoxNotAsked } = sfoxFrontendActions
    const { showModal } = modalActions
    const plaidUrl = `${plaidBaseUrl}/wallet-helper/plaid/#/key/${plaidKey}/env/${plaidEnv}`

    let awaitingDeposits = false
    if (Remote.Success.is(accounts)) {
      awaitingDeposits =
        prop('status', head(accounts.getOrElse())) === 'pending'
    }

    const { sfoxBusy, err } = busyStatus.cata({
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
          this.setState({ addBankManually: !this.state.addBankManually })
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
        microStep={this.state.microStep}
        goToMicroDepositStep={step => this.setState({ microStep: step })}
        submitMicroDeposits={this.submitMicroDeposits}
        awaitingDeposits={awaitingDeposits}
        showModal={showModal}
        busy={sfoxBusy}
        setNotAsked={sfoxNotAsked}
        linkError={err && path(['message'], err)}
        resetAccountHolder={this.resetAccountHolder}
        {...this.state}
      />
    )
  }
}

const mapStateToProps = getData

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
