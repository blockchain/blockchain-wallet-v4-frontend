import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'

import getData from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FirstStep extends React.PureComponent {
  render() {
    const { actions, coin, data } = this.props
    return data.cata({
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (value) => (
        <Success
          {...value}
          coin={coin}
          handleFeeToggle={actions.sendEthFirstStepFeeToggled}
          onSubmit={actions.sendEthFirstStepSubmitClicked}
        />
      )
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps.coin)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.components.sendEth, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStep)
