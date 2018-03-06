import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'

import EditDescription from './template'

class EditDescriptionContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { value: props.value, editValue: props.value, toggled: false }
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
    this.setState({ editValue: e.target.value })
  }

  handleConfirm () {
    const val = this.state.editValue
    this.setState({ value: val, toggled: false })
    this.dispatchConfirm(this.state.editValue)
  }

  handleToggle () {
    this.setState({ toggled: true })
  }

  render () {
    const { value, editValue, toggled } = this.state

    return <EditDescription
      value={value}
      editValue={editValue}
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
