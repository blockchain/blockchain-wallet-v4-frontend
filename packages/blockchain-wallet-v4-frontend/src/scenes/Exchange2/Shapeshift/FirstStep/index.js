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
        effectiveBalance={value.effectiveBalance}
        loading={value.loading}
        validationError={value.error}
        handleMaximum={() => this.props.actions.maximumClicked()}
        handleMinimum={() => this.props.actions.minimumClicked()}
        handleSubmit={() => this.props.actions.submitClicked()}
        handleSwap={() => this.props.actions.swapClicked()}
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
