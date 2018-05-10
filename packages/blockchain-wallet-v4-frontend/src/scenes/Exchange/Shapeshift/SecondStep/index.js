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
    const { data, actions } = this.props

    return data.cata({
      Success: (value) => <Success
        sourceCoin={value.sourceCoin}
        sourceAmount={value.sourceAmount}
        sourceFee={value.sourceFee}
        sourceTotal={value.sourceTotal}
        exchangeRate={value.exchangeRate}
        targetCoin={value.targetCoin}
        targetAmount={value.targetAmount}
        targetFee={value.targetFee}
        targetLabel={value.targetLabel}
        expiration={value.expiration}
        handleSubmit={(e) => { e.preventDefault(); actions.secondStepSubmitClicked() }}
        handleCancel={() => actions.secondStepCancelClicked()}
        handleExpiry={() => actions.secondStepOrderExpired()}
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
  actions: bindActionCreators(actions.components.exchange, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SecondStepContainer)
