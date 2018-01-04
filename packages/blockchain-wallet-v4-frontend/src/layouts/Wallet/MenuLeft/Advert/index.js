import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { equals } from 'ramda'

import { RemoteData } from 'blockchain-wallet-v4/src'
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

    return RemoteData.caseOf(data.value, {
      Success: (value) => <Success adverts={value} />,
      Failed: (message) => <Error>{message}</Error>,
      _: () => <Loading />
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
