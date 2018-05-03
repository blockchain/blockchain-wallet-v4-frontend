import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class ActivityListContainer extends React.PureComponent {
  componentDidMount () {
    this.props.actions.initialized()
  }

  render () {
    return this.props.data.cata({
      Success: (value) => <Success activities={value} />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, 8)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.components.activityList, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ActivityListContainer)
