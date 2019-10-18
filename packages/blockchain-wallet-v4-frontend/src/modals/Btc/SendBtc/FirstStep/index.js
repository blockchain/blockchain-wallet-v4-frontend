import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getData, getBtcData } from './selectors'
import { actions } from 'data'

import Loading from './template.loading'
import Success from './template.success'
import DataError from 'components/DataError'

class FirstStep extends React.Component {
  handleRefresh = () => {
    this.props.actions.initialized()
  }

  render () {
    const { actions, amount, data, excludeHDWallets, payPro, to } = this.props
    return data.cata({
      Success: value => (
        <Success
          autofilled={!!(amount && to)}
          destination={value.destination}
          effectiveBalance={value.effectiveBalance}
          enableToggle={value.enableToggle}
          excludeLockbox={value.excludeLockbox}
          excludeHDWallets={excludeHDWallets}
          feePerByte={value.feePerByte}
          feePerByteElements={value.feePerByteElements}
          feePerByteToggled={value.feePerByteToggled}
          from={value.from}
          handleBitPayInvoiceExpiration={actions.sendBtcBitPayInvoiceExpired}
          handleFeePerByteToggle={actions.sendBtcFirstStepFeePerByteToggled}
          maxFeePerByte={value.maxFeePerByte}
          minFeePerByte={value.minFeePerByte}
          network={value.network}
          onSubmit={actions.sendBtcFirstStepSubmitClicked}
          payPro={payPro}
          priorityFeePerByte={value.priorityFeePerByte}
          regularFeePerByte={value.regularFeePerByte}
          totalFee={value.totalFee}
          watchOnly={value.watchOnly}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FirstStep)
