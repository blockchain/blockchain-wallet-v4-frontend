import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import DataError from 'components/DataError'
import { actions } from 'data'

import { getBtcData, getData } from './selectors'
import Loading from './template.loading'
import Success from './template.success'

class FirstStep extends React.Component {
  handleRefresh = () => {
    const { amount, description, from, lockboxIndex, payPro, to } = this.props
    this.props.actions.initialized({
      from,
      to,
      description,
      amount,
      lockboxIndex,
      payPro
    })
  }

  render() {
    const { actions, amount, data, excludeHDWallets, payPro, to } = this.props
    return data.cata({
      Success: value => (
        <Success
          {...value}
          autofilled={!!(amount && to)}
          excludeHDWallets={excludeHDWallets}
          handleBitPayInvoiceExpiration={actions.sendBtcBitPayInvoiceExpired}
          handleFeePerByteToggle={actions.sendBtcFirstStepFeePerByteToggled}
          onSubmit={actions.sendBtcFirstStepSubmitClicked}
          payPro={payPro}
        />
      ),
      Failure: message => (
        <DataError onClick={this.handleRefresh} message={message} />
      ),
      NotAsked: () => <Loading />,
      Loading: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state),
  btcData: getBtcData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.sendBtc, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStep)
