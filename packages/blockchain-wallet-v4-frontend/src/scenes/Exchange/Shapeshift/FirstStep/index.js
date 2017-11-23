import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { assoc, equals, path } from 'ramda'

import { actions, selectors } from 'data'
import FirstStep from './template.js'

class FirstStepContainer extends React.Component {
  constructor (props) {
    super(props)
    const amount = this.props.amount || 0
    const sourceCoin = path(['source', 'coin'], this.props.accounts) || 'BTC'
    const targetCoin = path(['target', 'coin'], this.props.accounts) || 'ETH'

    this.state = { sourceCoin, targetCoin, amount }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount () {
    this.props.formActions.initialize('exchange', this.props.initialValues)
  }

  componentWillReceiveProps (nextProps) {
    const { amount, accounts } = nextProps

    if (!equals(this.props.accounts, accounts)) {
      const sourceCoin = path(['source', 'coin'], accounts)
      const targetCoin = path(['target', 'coin'], accounts)
      this.setState({ sourceCoin, targetCoin })
    }

    if (!equals(this.props.amount, amount)) {
      this.setState({ amount })
    }
  }

  handleSubmit () {
    this.props.nextStep()
  }

  render () {
    const { sourceCoin, targetCoin, amount } = this.state

    return <FirstStep sourceCoin={sourceCoin} targetCoin={targetCoin} sourceAmount={amount} handleSubmit={this.handleSubmit} {...this.props} />
  }
}

const mapStateToProps = (state) => {
  const source = selectors.core.wallet.getDefaultAccount(state)
  console.log(source)
  const target = selectors.core.kvStore.ethereum.getDefaultAccount(state)
  const initialValues = {
    accounts: {
      source: assoc('coin', 'BTC', source),
      target: assoc('coin', 'ETH', target)
    }
  }

  return {
    initialValues,
    accounts: formValueSelector('exchange')(state, 'accounts'),
    amount: formValueSelector('exchange')(state, 'amount')
  }
}

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  shapeShiftActions: bindActionCreators(actions.payment.shapeShift, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStepContainer)
