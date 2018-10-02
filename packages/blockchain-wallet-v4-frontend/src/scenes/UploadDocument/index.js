import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions, selectors } from 'data'
import UploadDocument from './template'

class UploadDocumentContainer extends Component {
  static propTypes = {
    displayError: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired,
    uploadDocument: PropTypes.func.isRequired
  }

  onDropAccepted = files => {
    const fileSizeLimit = 5000000
    const token = this.props.pathname.split('/')[2]
    files.forEach(file => {
      if (file.size >= fileSizeLimit) {
        this.props.displayError('File over size limit')
      } else {
        const fileReader = new FileReader()
        fileReader.onload = event => {
          const fileArray = new Int8Array(event.target.result)
          this.props.uploadDocument(token, fileArray)
        }
        fileReader.readAsArrayBuffer(file)
      }
    })
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
  displayError: bindActionCreators(actions.alerts.displayError, dispatch),
  uploadDocument: bindActionCreators(
    actions.components.uploadDocument.upload,
    dispatch
  )
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadDocumentContainer)
