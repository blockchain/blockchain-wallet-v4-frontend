import { actions, selectors } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import React from 'react'
import Success from './template.success'

class Table extends React.PureComponent {
  render () {
    const { data, supportedCoins, viewType } = this.props

    if (data.cata) {
      return data.cata({
        Success: values => (
          <Success
            balances={values}
            viewType={viewType}
            supportedCoins={supportedCoins}
          />
        ),
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
  data: getData(state, ownProps),
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrFail()
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.refresh, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Table)
