import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getData } from './selectors'
import { actions } from 'data'

import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class SecondStepContainer extends React.PureComponent {
  render () {
    const { data, actions } = this.props
    return data.cata({
      Success: (value) => <Success
        {...value}
        coin='BTC'
        handleSubmit={() => actions.sendBtcSecondStepSubmitClicked()}
        handleBack={() => actions.sendBtcSecondStepCancelClicked()}
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

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.components.sendBtc, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SecondStepContainer)
