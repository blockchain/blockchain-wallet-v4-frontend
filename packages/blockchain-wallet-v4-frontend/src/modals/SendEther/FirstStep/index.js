import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getData } from './selectors'
import { actions } from 'data'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FirstStep extends React.PureComponent {
  render () {
    return this.props.data.cata({
      Success: value => <Success
        fee={value.fee}
        isContract={value.isContract}
        unconfirmedTx={value.unconfirmedTx}
        effectiveBalance={value.effectiveBalance}
        onSubmit={() => this.props.actions.sendEthFirstStepSubmitClicked()}
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
