import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class SecondStepContainer extends React.Component {
  componentDidMount () {
    this.props.actions.secondStepInitialized()
  }

  render () {
    return this.props.data.cata({
      Success: (value) => <Success
        sourceCoin={value.sourceCoin}
        sourceAmount={value.sourceAmount}
        sourceFee={value.sourceFee}
        sourceTotal={value.sourceTotal}
        exchangeRate={value.exchangeRate}
        targetCoin={value.targetCoin}
        targetAmount={value.targetAmount}
        targetFee={value.targetFee}
        expiration={value.expiration}
        handleSubmit={() => this.props.actions.secondStepSubmitClicked()}
        handleCancel={() => this.props.actions.secondStepCancelClicked()}
        handleExpiry={() => this.props.actions.secondStepOrderExpired()}
      />,
      Failure: (message) => <Error />,
      Loading: () => <Loading />,
      NotAsked: () => <Success />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.exchange, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SecondStepContainer)
