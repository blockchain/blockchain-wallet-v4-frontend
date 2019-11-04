import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react'

import { actions } from 'data'
import { getBtcData, getData } from './selectors'
import DataError from 'components/DataError'
import Loading from './template.loading'
import Success from './template.success'

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
