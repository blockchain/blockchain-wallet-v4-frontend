import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FirstStepContainer extends React.Component {
  componentDidMount () {
    this.props.actions.firstStepInitialized()
  }

  render () {
    console.log('render', this.props.data)

    return this.props.data.cata({
      Success: (value) => <Success
        accounts={value.accounts}
        effectiveBalance={value.effectiveBalance}
        enabled={value.enabled}
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
