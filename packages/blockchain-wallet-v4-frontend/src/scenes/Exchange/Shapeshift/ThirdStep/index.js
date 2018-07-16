
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class ThirdStepContainer extends React.Component {
  componentDidMount () {
    this.props.actions.thirdStepInitialized()
  }

  render () {
    const { data, actions } = this.props
    return data.cata({
      Success: (value) => <Success
        sourceCoin={value.sourceCoin}
        targetCoin={value.targetCoin}
        status={value.status}
        exchangeRate={value.exchangeRate}
        transactionFee={value.transactionFee}
        orderId={value.orderId}
        depositAmount={value.depositAmount}
        withdrawalAmount={value.withdrawalAmount}
        handleClose={() => actions.thirdStepCloseClicked()}
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

export default connect(mapStateToProps, mapDispatchToProps)(ThirdStepContainer)
