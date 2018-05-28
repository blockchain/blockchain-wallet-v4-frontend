import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import Loading from './template.loading'
import Success from './template.success'
import DataError from 'components/DataError'

class FirstStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.onRefresh = this.onRefresh.bind(this)
  }

  componentDidMount () {
    this.props.actions.firstStepInitialized()
  }

  onRefresh () {
    this.props.coreActions.refresh()
  }

  render () {
    return this.props.data.cata({
      Success: (value) => <Success
        elements={value.elements}
        initialValues={value.initialValues}
        hasOneAccount={value.hasOneAccount}
        disabled={value.disabled}
        minimum={value.minimum}
        maximum={value.maximum}
        formError={value.formError}
        currency={value.currency}
        sourceCoin={value.sourceCoin}
        targetCoin={value.targetCoin}
        handleMaximum={() => this.props.actions.firstStepMaximumClicked()}
        handleMinimum={() => this.props.actions.firstStepMinimumClicked()}
        handleSubmit={() => this.props.actions.firstStepSubmitClicked()}
        handleSwap={() => this.props.actions.firstStepSwapClicked()}
      />,
      Failure: (message) => <DataError onClick={this.onRefresh} message={message} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  coreActions: bindActionCreators(actions.core.refresh, dispatch),
  actions: bindActionCreators(actions.components.exchange, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStepContainer)
