import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { selectors } from 'data'
import UploadDocumentSuccess from './template'

class UploadDocumentSuccessContainer extends Component {
  static propTypes = {
    reference: PropTypes.string.isRequired
  }

  render () {
    return <UploadDocumentSuccess reference={this.props.reference} />
  }
}

const mapStateToProps = state => ({
  reference: selectors.components.uploadDocument.getReference(state)
})

export default connect(mapStateToProps)(UploadDocumentSuccessContainer)
