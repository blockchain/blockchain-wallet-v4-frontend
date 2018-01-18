import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { equals } from 'ramda'

import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class AdvertContainer extends React.Component {
  componentWillMount () {
    this.props.actions.fetchAdverts(2)
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(this.props.location, nextProps.location)) {
      this.props.actions.fetchAdverts(2)
    }
  }

  render () {
    const { data } = this.props
    return data.cata({
      Success: (value) => <Success adverts={value} />,
      Failure: (message) => <Error>{message}</Error>,
      NotAsked: () => <Loading />,
      Loading: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.core.data.misc, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(AdvertContainer)
