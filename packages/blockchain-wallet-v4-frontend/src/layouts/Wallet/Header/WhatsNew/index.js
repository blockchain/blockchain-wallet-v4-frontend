import React from 'react'
import { connect } from 'react-redux'
import { selectors } from 'data'
import WhatsNew from './template.js'

class WhatsNewContainer extends React.Component {
  render () {
    const { lastViewed } = this.props
    return <WhatsNew lastViewed={lastViewed} />
  }
}

const mapStateToProps = (state) => ({
  // lastViewed: selectors.core.kvStore.whatsNew.getLastViewed(state)
  lastViewed: 0
})

export default connect(mapStateToProps)(WhatsNewContainer)
