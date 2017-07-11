import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'

import { Icon } from 'components/generic/Icon'
import Modal from 'components/generic/Modal'
import { Text } from 'components/generic/Text'

const Title = props => (
  <div>
    <Icon name='icon-send' bigger />
    <Text id='modals.requestbitcoin.secondstep.created' text='Request Created' bigger light />
  </div>
)

const SecondStep = (props) => {
  console.log(props)
  return (
    <Modal title={Title} {...props}>
      <div>TEST</div>
    </Modal>
  )
}

SecondStep.defaultProps = {
  show: false,
  animation: true
}

SecondStep.propTypes = {
  show: PropTypes.bool.isRequired,
  animation: PropTypes.bool
}

export default reduxForm({ form: 'requestBitcoinForm' })(SecondStep)
