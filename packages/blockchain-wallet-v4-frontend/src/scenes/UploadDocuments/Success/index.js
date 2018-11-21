import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { selectors } from 'data'
import UploadDocumentsSuccess from './template'

class UploadDocumentsSuccessContainer extends Component {
  static propTypes = {
    reference: PropTypes.string.isRequired
  }

  render () {
    return <UploadDocumentsSuccess reference={this.props.reference} />
  }
}

const mapStateToProps = state => ({
  reference: selectors.components.uploadDocuments.getReference(state)
})

export default connect(mapStateToProps)(UploadDocumentsSuccessContainer)
