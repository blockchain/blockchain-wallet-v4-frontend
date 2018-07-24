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
    this.handleRefresh = this.handleRefresh.bind(this)
  }

  componentDidMount () {
    this.props.actions.firstStepInitialized()
  }

  handleRefresh () {
    this.props.refreshActions.refresh()
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
        onSubmit={() => this.props.actions.firstStepSubmitClicked()}
        handleSwap={() => this.props.actions.firstStepSwapClicked()}
      />,
      Failure: (message) => <DataError onClick={this.handleRefresh} message={message} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  refreshActions: bindActionCreators(actions.core.refresh, dispatch),
  actions: bindActionCreators(actions.components.exchange, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStepContainer)
