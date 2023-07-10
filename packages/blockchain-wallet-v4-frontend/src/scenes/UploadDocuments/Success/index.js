import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { selectors } from 'data'

import UploadDocumentsSuccess from './template'

const UploadDocumentsSuccessContainer = ({ reference }) => (
  <UploadDocumentsSuccess reference={reference} />
)

UploadDocumentsSuccessContainer.propTypes = {
  reference: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
  reference: selectors.components.uploadDocuments.getReference(state)
})

export default connect(mapStateToProps)(UploadDocumentsSuccessContainer)
