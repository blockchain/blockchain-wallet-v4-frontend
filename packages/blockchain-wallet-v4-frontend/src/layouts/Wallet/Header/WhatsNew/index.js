import React from 'react'
import { connect } from 'react-redux'
import { selectors } from 'data'
import WhatsNew from './template.js'

class WhatsNewContainer extends React.Component {
  render () {
    return <WhatsNew />
  }
}

const mapStateToProps = (state) => ({
  lastViewed: selectors.core.kvStore.whatsNew.getLastViewed(state)
})

export default connect(mapStateToProps)(WhatsNewContainer)
