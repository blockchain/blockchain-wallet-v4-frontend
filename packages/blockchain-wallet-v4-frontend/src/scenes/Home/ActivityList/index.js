import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class ActivityListContainer extends React.Component {
  componentWillMount () {
    this.props.actions.fetchLogs()
  }

  render () {
    const { data } = this.props

    return data.cata({
      Success: (value) => <Success activities={value} />,
      Failed: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, 8)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.core.data.misc, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ActivityListContainer)
