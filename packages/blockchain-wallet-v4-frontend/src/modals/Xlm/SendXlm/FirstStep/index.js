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
    const { actions, data } = this.props
    return data.cata({
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (value) => (
        <Success {...value} {...this.props} onSubmit={actions.firstStepSubmitClicked} />
      )
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.components.sendXlm, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  swapActions: bindActionCreators(actions.components.swap, dispatch),
  verifyIdentity: () =>
    dispatch(
      actions.components.identityVerification.verifyIdentity({
        needMoreInfo: false,
        origin: 'Send',
        tier: 2
      })
    )
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStep)
