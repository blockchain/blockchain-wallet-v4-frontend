import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'

import EditDescription from './template'

class EditDescriptionContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { value: props.value, toggled: false }
    this.dispatchConfirm = props.handleConfirm
    this.handleCancel = this.handleCancel.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
  }

  handleCancel () {
    this.setState({ toggled: false })
  }

  handleChange (e) {
    this.setState({ value: e.target.value })
  }

  handleConfirm () {
    this.setState({ toggled: false })
    this.dispatchConfirm(this.state.value)

  }

  handleToggle () {
    this.setState({ toggled: true })
  }

  render () {
    const { value, toggled } = this.state

    return <EditDescription
      value={value}
      toggled={toggled}
      handleCancel={this.handleCancel}
      handleChange={this.handleChange}
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
