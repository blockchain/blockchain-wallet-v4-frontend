import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getData } from './selectors'
import { actions } from 'data'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FirstStep extends React.Component {
  componentDidMount () {
    this.props.actions.sendBtcFirstStepInitialized()
  }

  render () {
    const { data, actions } = this.props

    return data.cata({
      Success: value => <Success
        watchOnly={value.watchOnly}
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
        handleSubmit={() => actions.sendBtcFirstStepSubmitClicked()}
        handleFeePerByteToggle={() => actions.sendBtcFirstStepFeePerByteToggled()}
        handleToToggle={(val) => actions.sendBtcFirstStepToToggled(val)}
      />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.sendBtc, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStep)
