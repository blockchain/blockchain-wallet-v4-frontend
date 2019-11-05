import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getData } from './selectors'
import Footer from './template'
import React from 'react'

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
