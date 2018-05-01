import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getData } from './selectors'
import { actions } from 'data'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FirstStep extends React.Component {
  componentDidMount () {
    this.props.actions.sendBchFirstStepInitialized()
  }

  render () {
    const { data, actions } = this.props

    return data.cata({
      Success: value => <Success
        toToggled={value.toToggled}
        destination={value.destination}
        effectiveBalance={value.effectiveBalance}
        totalFee={value.totalFee}
        handleSubmit={() => actions.sendBchFirstStepSubmitClicked()}
        handleToToggle={() => actions.sendBchFirstStepToToggled()}
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
  actions: bindActionCreators(actions.components.sendBch, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStep)
