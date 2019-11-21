import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react'

import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FirstStep extends React.Component {
  render () {
    const { data, actions } = this.props
    return data.cata({
      Success: value => (
        <Success
          from={value.from}
          network={value.network}
          watchOnly={value.watchOnly}
          destination={value.destination}
          effectiveBalance={value.effectiveBalance}
          totalFee={value.totalFee}
          onSubmit={actions.sendBchFirstStepSubmitClicked}
          excludeLockbox={value.excludeLockbox}
          excludeHDWallets={this.props.excludeHDWallets}
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
  actions: bindActionCreators(actions.components.sendBch, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FirstStep)
