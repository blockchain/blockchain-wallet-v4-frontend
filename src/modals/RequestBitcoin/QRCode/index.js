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
    <Text id='modals.requestbitcoin.qrcode.address' text='Payment Address' bigger light />
  </div>
)

const QRCode = (props) => {
  return (
    <Modal title={Title} show={this.props.show}>
      TEST
    </Modal>
  )
}

QRCode.defaultProps = {
  show: false,
  animation: true
}

QRCode.propTypes = {
  show: PropTypes.bool.isRequired,
  animation: PropTypes.bool
}

export default reduxForm({ form: 'requestBitcoinForm' })(QRCode)
