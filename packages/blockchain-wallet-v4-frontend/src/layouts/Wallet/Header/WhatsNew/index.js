import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class WhatsNewContainer extends React.Component {
  componentWillMount () {
    // this.props.actions.fetchMetadataWhatsnew()
  }

  render () {
    const { data } = this.props

    return data.cata({
      Success: (value) => <Success lastViewed={value} />,
      Failure: (message) => <Error>{message}</Error>,
      NotAsked: () => <Loading />,
      Loading: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.core.kvStore.whatsNew, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(WhatsNewContainer)
