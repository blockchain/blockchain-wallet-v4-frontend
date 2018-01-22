
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { Remote } from 'blockchain-wallet-v4/src'
import { actions } from 'data'
// import Settings from './template.js'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'
import { getData } from './selectors'

class HintContainer extends React.Component {
  componentWillMount () {
    if (Remote.NotAsked.is(this.props.data)) {
      this.props.actions.fetchSettings()
    }
  }

  render () {
    const { data, ...rest } = this.props

    return data.cata({
      Success: (value) => <Success {...rest}
        currentHint={value} />,
      Failure: (message) => <Error {...rest}
        message={message} />,
      Loading: () => <Loading {...rest} />,
      NotAsked: () => <Loading {...rest} />
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.core.settings, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(HintContainer)
