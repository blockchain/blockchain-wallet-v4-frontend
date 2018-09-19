import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getData } from './selectors'
import { actions } from 'data'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class Table extends React.PureComponent {
  render () {
    const { data, viewType } = this.props

    if (data.cata) {
      return data.cata({
        Success: values => <Success balances={values} viewType={viewType} />,
        Failure: msg => (
          <Error handleRefresh={this.props.actions.refreshClicked}>{msg}</Error>
        ),
        Loading: () => <Loading />,
        NotAsked: () => <Loading />
      })
    }

    return null
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.refresh, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Table)
