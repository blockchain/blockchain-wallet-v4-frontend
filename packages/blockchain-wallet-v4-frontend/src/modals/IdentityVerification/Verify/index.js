import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions } from 'data'
import { getData } from './selectors'

import Verify from './template.success'
import Loading from './template.loading'

class VerifyContainer extends React.PureComponent {
  componentDidMount () {
    const { actions } = this.props
    actions.fetchSupportedDocuments()
  }

  render () {
    const { data, ...rest } = this.props

    return data.cata({
      Success: val => <Verify supportedDocuments={val} {...rest} />,
      Loading: () => <Loading />,
      NotAsked: () => null,
      Failure: () => null
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.identityVerification, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VerifyContainer)
