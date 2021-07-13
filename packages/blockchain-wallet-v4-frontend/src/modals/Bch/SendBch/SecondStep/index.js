import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'

import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class SecondStepContainer extends React.PureComponent {
  render() {
    const { actions, data } = this.props
    return data.cata({
      Success: value => (
        <Success
          {...value}
          coin='BCH'
          handleSubmit={actions.sendBchSecondStepSubmitClicked}
          handleBack={actions.sendBchSecondStepCancelClicked}
          handleBitPayInvoiceExpiration={actions.sendBchBitPayInvoiceExpired}
        />
      ),
      Failure: message => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.sendBch, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SecondStepContainer)
