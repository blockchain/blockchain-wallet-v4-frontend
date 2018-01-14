import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { getData } from './selectors'
import { actions } from 'data'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

import modalEnhancer from 'providers/ModalEnhancer'

class PairingCodeContainer extends React.Component {
  componentWillMount () {
    this.props.actions.encodePairingCode()
  }

  render () {
    const { data } = this.props

    return data.cata({
      Success: (val) => <Success val={val} {...this.props} />,
      Failure: (message) => <Error {...this.props}>{message}</Error>,
      Loading: () => <Loading {...this.props} />,
      NotAsked: () => <Loading {...this.props} />
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.core.data.misc, dispatch)
})

const enhance = compose(
  modalEnhancer('PairingCode'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(PairingCodeContainer)
