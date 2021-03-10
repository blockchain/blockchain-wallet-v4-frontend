import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'

import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class SettingContainer extends React.PureComponent {
  componentDidMount() {
    this.props.actions.notificationsInitialized()
  }

  render() {
    return this.props.data.cata({
      Success: value => <Success {...value} />,
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
  actions: bindActionCreators(actions.components.settings, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingContainer)
