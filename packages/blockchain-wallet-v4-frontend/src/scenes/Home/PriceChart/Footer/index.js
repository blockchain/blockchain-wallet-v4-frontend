import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions } from 'data'
import { getData } from './selectors'
import Footer from './template'

class FooterContainer extends React.PureComponent {
  render () {
    return <Footer {...this.props} />
  }
}

const mapStateToProps = state => getData(state)

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FooterContainer)
