import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Upload from './template'
import { actions } from 'data'
import { getData } from './selectors'
import Failure from 'components/BuySell/Failure'

class UploadContainer extends Component {
  state = {
    files: [],
    camera: false,
    photo: '',
    busy: false
  }

  resetUpload = () => {
    this.setState({ files: [], camera: false, photo: '' })
  }

  handleDrop = files => {
    this.setState({
      files: files.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      )
    })
  }

  submitForUpload = () => {
    const { verificationStatus } = this.props.data.getOrElse({})
    if (!verificationStatus) return

    const file = this.state.files[0] || this.state.photo
    const idType = verificationStatus.required_docs[0]
    this.props.sfoxFrontendActions.upload({ file, idType })
    this.resetUpload() // TODO replace with setting to busy and show loader
  }

  render () {
    const { data } = this.props

    return data.cata({
      Success: value => (
        <Upload
          data={value}
          handleSubmit={e => e.preventDefault()}
          onDrop={this.handleDrop}
          onClickUpload={e => e.preventDefault()}
          toggleCamera={() => this.setState({ camera: true })}
          file={this.state.files[0]}
          showCamera={this.state.camera}
          photo={this.state.photo}
          setPhoto={data => this.setState({ photo: data })}
          resetUpload={this.resetUpload}
          submitForUpload={this.submitForUpload}
        />
      ),
      Failure: msg => <Failure error={msg} />,
      Loading: () => <div />,
      NotAsked: () => <div />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch),
  sfoxFrontendActions: bindActionCreators(actions.modules.sfox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadContainer)
