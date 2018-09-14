import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'

import { actions } from 'data'
import { getData, getFormValues } from './selectors'
import LockboxMenu from './template'

class LockboxMenuContainer extends React.PureComponent {
  render () {
    const { data, ...rest } = this.props
    return data.cata({
      Success: val => <LockboxMenu deviceInfo={val} {...rest} />,
      Loading: () => <div>Loading</div>,
      Failure: () => <div>Failure</div>,
      NotAsked: () => null
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state),
  formValues: getFormValues(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.lockbox, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)
export default enhance(LockboxMenuContainer)
