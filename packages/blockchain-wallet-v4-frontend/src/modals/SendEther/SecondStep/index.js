import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class SecondStepContainer extends React.PureComponent {
  render () {
    const { data, actions } = this.props

    return data.cata({
      Success: (value) => <Success
        coin='ETH'
        fromAddress={value.fromAddress}
        toAddress={value.toAddress}
        message={value.message}
        amount={value.amount}
        fee={value.fee}
        total={value.total}
        handleBack={() => actions.sendEthSecondStepCancelClicked()}
        handleSubmit={() => actions.sendEthSecondStepSubmitClicked()}
      />,
      Error: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.components.sendEth, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SecondStepContainer)
