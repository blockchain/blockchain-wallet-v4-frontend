import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { equals } from 'ramda'

import { actions } from 'data'
import { getAdvert } from './selectors'
import Advert from './template'

class AdvertContainer extends React.Component {
  componentWillMount () {
    this.props.actions.fetchAdverts(2)
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(this.props.location, nextProps.location)) { this.props.actions.initAdvert(2) }
  }

  render () {
    // return <Advert adverts={this.props.advert.data} />
    return <div />
  }
}

const mapStateToProps = (state, ownProps) => ({
  advert: getAdvert(state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.core.data.misc, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(AdvertContainer)
