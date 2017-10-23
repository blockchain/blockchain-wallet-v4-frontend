import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions, selectors } from 'data'
import WhatsNew from './template.js'

class WhatsNewContainer extends React.Component {
  render () {
    console.log(this.props.lastViewed)
    return <WhatsNew lastViewed={this.props.lastViewed} />
  }
}

const mapStateToProps = (state) => ({
  lastViewed: selectors.core.kvStore.whatsNew.getLastViewed(state)
})

const mapDispatchToProps = (dispatch) => ({
  kvActions: bindActionCreators(actions.core.kvStore.whatsNew, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(WhatsNewContainer)
