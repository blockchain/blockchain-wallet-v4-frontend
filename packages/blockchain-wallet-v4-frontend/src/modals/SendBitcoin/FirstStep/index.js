import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getData, getBtcData } from './selectors'
import { actions } from 'data'
import Loading from './template.loading'
import Success from './template.success'
import DataError from 'components/DataError'
import { Remote } from 'blockchain-wallet-v4/src'

class FirstStep extends React.Component {
  constructor (props) {
    super(props)
    this.handleRefresh = this.handleRefresh.bind(this)
  }

  componentDidUpdate (prevProps) {
    if (!Remote.Success.is(prevProps.btcData) && Remote.Success.is(this.props.btcData)) {
      this.props.actions.sendBtcInitialized({})
    }
  }

  handleRefresh () {
    this.props.refreshActions.refresh()
  }

  render () {
    const { data, actions } = this.props

    return data.cata({
      Success: value => <Success
        from={value.from}
        watchOnly={value.watchOnly}
        addressMatchesPriv={value.addressMatchesPriv}
        enableToggle={value.enableToggle}
        toToggled={value.toToggled}
        destination={value.destination}
        feePerByteToggled={value.feePerByteToggled}
        feePerByteElements={value.feePerByteElements}
        effectiveBalance={value.effectiveBalance}
        minFeePerByte={value.minFeePerByte}
        maxFeePerByte={value.maxFeePerByte}
        regularFeePerByte={value.regularFeePerByte}
        priorityFeePerByte={value.priorityFeePerByte}
        isPriorityFeePerByte={value.isPriorityFeePerByte}
        totalFee={value.totalFee}
        onSubmit={() => actions.sendBtcFirstStepSubmitClicked()}
        handleFeePerByteToggle={() => actions.sendBtcFirstStepFeePerByteToggled()}
        handleToToggle={(val) => actions.sendBtcFirstStepToToggled(val)}
      />,
      NotAsked: () => <DataError onClick={this.handleRefresh} />,
      Failure: () => <DataError onClick={this.handleRefresh} />,
      Loading: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state),
  btcData: getBtcData(state)
})

const mapDispatchToProps = dispatch => ({
  refreshActions: bindActionCreators(actions.core.refresh, dispatch),
  actions: bindActionCreators(actions.components.sendBtc, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStep)
