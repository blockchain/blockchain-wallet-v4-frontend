import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { isEmpty } from 'ramda'

import { actions, selectors } from 'data'
import Advert from './template.js'

class AdvertContainer extends React.Component {
  componentWillMount () {
    if (isEmpty(this.props.adverts)) { this.props.advertsActions.fetchAdverts(2) }
  }

  render () {
    const { adverts } = this.props

    return (
      <Advert adverts={adverts} />
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  adverts: selectors.core.adverts.selectAdverts(state)
})

const mapDispatchToProps = (dispatch) => ({
  advertsActions: bindActionCreators(actions.core.adverts, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(AdvertContainer)
