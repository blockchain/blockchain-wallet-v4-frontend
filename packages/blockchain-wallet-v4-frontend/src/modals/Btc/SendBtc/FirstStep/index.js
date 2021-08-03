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
    const { amount, description, from, payPro, to } = this.props
    this.props.actions.initialized({
      amount,
      description,
      from,
      payPro,
      to
    })
  }

  render() {
    const { actions, amount, data, excludeHDWallets, payPro, to } = this.props
    return data.cata({
      Failure: (message) => <DataError onClick={this.handleRefresh} message={message} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (value) => (
        <Success
          {...value}
          autofilled={!!(amount && to)}
          excludeHDWallets={excludeHDWallets}
          handleBitPayInvoiceExpiration={actions.sendBtcBitPayInvoiceExpired}
          handleFeePerByteToggle={actions.sendBtcFirstStepFeePerByteToggled}
          onSubmit={actions.sendBtcFirstStepSubmitClicked}
          payPro={payPro}
        />
      )
    })
  }
}

const mapStateToProps = (state) => ({
  btcData: getBtcData(state),
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.components.sendBtc, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStep)
