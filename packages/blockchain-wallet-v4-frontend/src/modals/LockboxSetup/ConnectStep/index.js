import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from 'data'

import { getData } from './selectors'
import Loading from './template.loading'
import Failure from './template.failure'
import Success from './template.success'

class OptionsStep extends React.PureComponent {
  componentDidMount () {
    this.props.lockboxActions.initializeConnect()
  }

  render () {
    const { data } = this.props
    return data.cata({
      Success: value => <Success value={value} />,
      Loading: () => <Loading />,
      Failure: msg => <Failure msg={msg} />,
      NotAsked: () => <div />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OptionsStep)
