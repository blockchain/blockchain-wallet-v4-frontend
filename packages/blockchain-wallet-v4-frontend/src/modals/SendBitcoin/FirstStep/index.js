import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getData, getBtcData } from './selectors'
import { actions } from 'data'
import Loading from './template.loading'
import Success from './template.success'
import DataError from 'components/DataError'

class FirstStep extends React.Component {
  constructor (props) {
    super(props)
    this.handleRefresh = this.handleRefresh.bind(this)
    this.handleToToggle = this.handleToToggle.bind(this)
  }

  handleRefresh () {
    this.props.actions.initialized()
  }

  handleToToggle (val) {
    this.props.formActions.touch('sendBtc', 'to')
    this.props.actions.sendBtcFirstStepToToggled(val)
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
        handleToToggle={this.handleToToggle}
      />,
      Failure: () => <DataError onClick={() => this.handleRefresh} />,
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
