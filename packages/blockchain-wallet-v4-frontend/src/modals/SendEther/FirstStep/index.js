import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getData } from './selectors'
import { actions } from 'data'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FirstStep extends React.PureComponent {
  componentDidMount () {
    this.props.actions.sendEthFirstStepInitialized()
  }

  render () {
    const { data, actions } = this.props

    return data.cata({
      Success: value => <Success
        effectiveBalance={value.effectiveBalance}
        fee={value.fee}
        handleSubmit={() => actions.sendEthFirstStepSubmitClicked()}
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
  actions: bindActionCreators(actions.components.sendEth, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStep)
