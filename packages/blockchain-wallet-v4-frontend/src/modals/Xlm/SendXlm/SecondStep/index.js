import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class SecondStepContainer extends React.PureComponent {
  onGoBack = () => {
    // TODO: this clears the previous form, find different way
    this.props.actions.initialized()
    this.props.actions.secondStepCancelClicked()
  }

  render () {
    const { data, actions } = this.props
    return data.cata({
      Success: value => (
        <Success
          coin='XLM'
          {...value}
          handleBack={this.onGoBack}
          handleSubmit={actions.secondStepSubmitClicked}
        />
      ),
      Error: message => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.sendXlm, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SecondStepContainer)
