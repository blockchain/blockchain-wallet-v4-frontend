import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getData } from './selectors'
import { actions, model } from 'data'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FirstStep extends React.PureComponent {
  handleToToggle = val => {
    this.props.formActions.touch(model.components.sendXlm.FORM, 'to')
    this.props.actions.firstStepToToggled(val)
  }

  render () {
    const { data, actions } = this.props
    return data.cata({
      Success: value => (
        <Success
          {...value}
          handleToToggle={this.handleToToggle}
          onSubmit={actions.firstStepSubmitClicked}
        />
      ),
      Failure: message => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.sendXlm, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FirstStep)
