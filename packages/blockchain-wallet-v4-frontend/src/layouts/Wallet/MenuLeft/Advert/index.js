import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { equals } from 'ramda'

import { actions, selectors } from 'data'
import Advert from './template.js'

class AdvertContainer extends React.Component {
  componentWillMount () {
    this.props.actions.initAdvert(2)
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(this.props.location, nextProps.location)) { this.props.actions.initAdvert(2) }
  }

  render () {
    return <Advert adverts={this.props.advert.data} />
  }
}

const mapStateToProps = (state, ownProps) => ({
  advert: selectors.modules.advert.getAdvert(state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.modules.advert, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(AdvertContainer)
