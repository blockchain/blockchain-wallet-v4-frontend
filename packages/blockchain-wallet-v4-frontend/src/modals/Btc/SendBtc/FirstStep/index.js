import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getBtcData, getData } from './selectors'
import { includes } from 'ramda'
import { NUMBER_OF_ADDRS_LIMIT } from 'blockchain-wallet-v4/src/redux/payment/model'
import AddressesLimitFailure from './template.failure.addresseslimit'
import DataError from 'components/DataError'
import Loading from './template.loading'
import React from 'react'
import Success from './template.success'

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
      Failure: message => {
        return includes(NUMBER_OF_ADDRS_LIMIT, message) ? (
          <AddressesLimitFailure {...this.props} />
        ) : (
          <DataError onClick={this.handleRefresh} message={message} />
        )
      },
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
