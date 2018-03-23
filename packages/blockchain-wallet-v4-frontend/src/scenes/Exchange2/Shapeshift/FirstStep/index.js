import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'adapter'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FirstStepContainer extends React.Component {
  render () {
    const { data, actions } = this.props

    return data.cata({
      Success: (value) => <Success 
        {...value}
        handleMaximum={() => actions.maximumClicked()}
        handleMinimum={() => actions.minimumClicked()}
        handleSubmit={() => actions.submitClicked()}
        handleSwap={() => actions.swapClicked()}
      />,
      Failure: (message) => <Error />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: selectors.components.exchange.getDataFirstStep(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.exchange, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStepContainer)
