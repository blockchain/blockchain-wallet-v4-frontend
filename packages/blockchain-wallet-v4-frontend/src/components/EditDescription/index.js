import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'

import EditDescription from './template'

class EditDescriptionContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { 'toggled': false }
    this.handleCancel = this.handleCancel.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
  }

  handleCancel () {
    this.setState({ toggled: false })
  }

  handleConfirm () {
    this.setState({ toggled: false })
  }

  handleToggle () {
    this.setState({ toggled: true })
  }

  render () {
    const { toggled } = this.state

    return <EditDescription
      value={this.props.value}
      toggled={toggled}
      handleCancel={this.handleCancel}
      handleConfirm={this.handleConfirm}
      handleToggle={this.handleToggle}
    />
  }
}

EditDescriptionContainer.propTypes = {
  value: PropTypes.string
}

// const mapStateToProps = state => ({

// })

// const mapDispatchToProps = dispatch => ({

// })

// export default connect(mapStateToProps, mapDispatchToProps)(EditDescriptionContainer)
export default EditDescriptionContainer
