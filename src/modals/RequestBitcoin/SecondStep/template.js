import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'

import Modal from 'components/generic/Modal'
import { Text } from 'components/generic/Text'

const SecondStep = (props) => {
  return (
    <Modal icon='icon-receive' title='Request created' size='large' show={props.show}>
      <div>TEST</div>
    </Modal>
  )
}

SecondStep.defaultProps = {
  show: false
}

SecondStep.propTypes = {
  show: PropTypes.bool.isRequired
}

export default reduxForm({ form: 'requestBitcoinForm' })(SecondStep)
