import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'adapter'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FirstStepContainer extends React.Component {
  render () {
    return this.props.data.cata({
      Success: (value) => <Success
        elements={value.elements}
        quotationLoading={value.quotationLoading}
        quotationError={value.quotationError}
        handleMaximum={() => this.props.actions.firstStepMaximumClicked()}
        handleMinimum={() => this.props.actions.firstStepMinimumClicked()}
        handleSubmit={() => this.props.actions.firstStepSubmitClicked()}
        handleSwap={() => this.props.actions.firstStepSwapClicked()}
      />,
      Failure: (message) => <Error />,
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

export default connect(mapStateToProps, mapDispatchToProps)(FirstStepContainer)
