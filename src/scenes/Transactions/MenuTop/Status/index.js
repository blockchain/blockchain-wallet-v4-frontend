import React from 'react'
import PropTypes from 'prop-types'
import Status from './template.js'

class StatusContainer extends React.Component {
  constructor (props) {
    super(props)
    this.click = this.click.bind(this)
  }

  click (value) {
    this.props.callback && this.props.callback(value)
  }

  render () {
    return (
      <Status items={this.props.items} selected={this.props.selected} callback={this.click} />
    )
  }
}

StatusContainer.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })),
  callback: PropTypes.func.isRequired,
  selected: PropTypes.string
}

StatusContainer.defaultProps = {
  callback: function (value) { console.log(value) }
}

export default StatusContainer
