import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getData } from './selectors'
import { actions } from 'data'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class LockboxBalance extends React.PureComponent {
  render () {
    return this.props.data.cata({
      Success: value => <Success totalBalance={value.totalBalance} />,
      Failure: msg => (
        <Error handleRefresh={this.props.actions.refreshClicked}>{msg}</Error>
      ),
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.refresh, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LockboxBalance)
