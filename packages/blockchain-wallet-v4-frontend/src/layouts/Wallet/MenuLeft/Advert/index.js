import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { isEmpty, equals } from 'ramda'

import { actions, selectors } from 'data'
import Advert from './template.js'

class AdvertContainer extends React.Component {
  componentWillMount () {
    if (isEmpty(this.props.adverts)) { this.props.dataActions.getAdverts(2) }
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(this.props.location, nextProps.location)) { this.props.dataActions.getAdverts(2) }
  }

  render () {
    const { adverts } = this.props

    return (
      <Advert adverts={adverts} />
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  adverts: selectors.core.data.adverts.getAdverts(state)
})

const mapDispatchToProps = (dispatch) => ({
  dataActions: bindActionCreators(actions.data, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(AdvertContainer)
