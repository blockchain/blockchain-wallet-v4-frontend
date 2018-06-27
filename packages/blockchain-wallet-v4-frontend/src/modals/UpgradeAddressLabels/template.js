import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { reduxForm } from 'redux-form'

import { Modal, ModalHeader, ModalBody, ModalFooter, Text } from 'blockchain-info-components'
import { Form } from 'components/Form'

const UpgradeAddressLabels = (props) => {
  const { duration, position, total} = props
  
  return (
    <Modal size='large' position={position} total={total}>
      <Form>
        <ModalBody>
          <Text size='14px' weight={300}>
            <FormattedMessage id='modals.upgradeaddresslabels.explain' defaultMessage="Upgrading your wallet this might take {duration} seconds." values={{ duration: duration }} />
          </Text>
        </ModalBody>
      </Form>
    </Modal>
  )
}

UpgradeAddressLabels.propTypes = {
  payload: PropTypes.shape({
    duration: PropTypes.number.isRequired
  })
}

export default reduxForm({ form: 'upgradeAddressLabels' })(UpgradeAddressLabels)
