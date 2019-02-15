import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'

import { getData } from './selectors'
import Footer from './template.js'

class FooterContainer extends React.PureComponent {
  render () {
    const { ...props } = this.props
    return <Footer {...props} />
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const enhance = compose(
  withRouter,
  connect(mapStateToProps)
)

export default enhance(FooterContainer)
