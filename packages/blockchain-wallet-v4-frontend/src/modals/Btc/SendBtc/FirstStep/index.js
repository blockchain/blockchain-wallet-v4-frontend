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
    const { data, actions } = this.props
    const autofilled = !!(this.props.amount && this.props.to)
    return data.cata({
      Success: value => (
        <Success
          from={value.from}
          network={value.network}
          watchOnly={value.watchOnly}
          enableToggle={value.enableToggle}
          destination={value.destination}
          feePerByte={value.feePerByte}
          feePerByteToggled={value.feePerByteToggled}
          feePerByteElements={value.feePerByteElements}
          effectiveBalance={value.effectiveBalance}
          minFeePerByte={value.minFeePerByte}
          maxFeePerByte={value.maxFeePerByte}
          regularFeePerByte={value.regularFeePerByte}
          priorityFeePerByte={value.priorityFeePerByte}
          totalFee={value.totalFee}
          onSubmit={actions.sendBtcFirstStepSubmitClicked}
          handleFeePerByteToggle={actions.sendBtcFirstStepFeePerByteToggled}
          excludeLockbox={value.excludeLockbox}
          excludeHDWallets={this.props.excludeHDWallets}
          payPro={this.props.payPro}
          handleBitPayInvoiceExpiration={
            actions.sendBtcFirstStepBitPayInvoiceExpired
          }
          autofilled={autofilled}
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
