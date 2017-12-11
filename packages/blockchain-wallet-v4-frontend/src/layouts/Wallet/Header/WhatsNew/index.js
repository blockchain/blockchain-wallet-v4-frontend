import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import WhatsNew from './template.js'

class WhatsNewContainer extends React.Component {
  componentWillMount () {
    this.props.actions.initWhatsNew()
  }

  render () {
    return <WhatsNew lastViewed={this.props.whatsNew.data} />
  }
}

const mapStateToProps = state => ({
  whatsNew: selectors.modules.whatsNew.getWhatsNew(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.modules.whatsNew, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(WhatsNewContainer)
