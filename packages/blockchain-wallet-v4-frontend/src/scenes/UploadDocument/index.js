import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions, selectors } from 'data'
import UploadDocument from './template'

class UploadDocumentContainer extends Component {
  static propTypes = {
    pathname: PropTypes.string.isRequired,
    uploadDocument: PropTypes.func.isRequired
  }

  onDropAccepted = files => {
    const token = this.props.pathname.split('/')[2]
    files.forEach(file => this.props.uploadDocument(token, file))
  }

  render () {
    const documentType = this.props.pathname.split('/')[3]
    return (
      <UploadDocument
        documentType={documentType}
        onDropAccepted={this.onDropAccepted}
      />
    )
  }
}

const mapStateToProps = state => ({
  pathname: selectors.router.getPathname(state)
})

const mapDispatchToProps = dispatch => ({
  uploadDocument: bindActionCreators(
    actions.components.uploadDocument.upload,
    dispatch
  )
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadDocumentContainer)
