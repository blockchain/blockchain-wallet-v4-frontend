import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Button } from 'blockchain-info-components'

const Google = (props) => {
  return (
    <div>google auth goes here</div>
  )
}

Google.propTypes = {
  authType: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default Google
