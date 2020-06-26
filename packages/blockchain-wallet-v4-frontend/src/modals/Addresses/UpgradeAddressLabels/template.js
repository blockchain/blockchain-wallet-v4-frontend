import { FormattedMessage } from 'react-intl'
import { reduxForm } from 'redux-form'
import PropTypes from 'prop-types'
import React from 'react'

import { Form } from 'components/Form'
import { Modal, ModalBody, Text } from 'blockchain-info-components'

const UpgradeAddressLabels = props => {
  const { duration, position, total } = props

  return (
    <Modal size='large' position={position} total={total}>
      <Form>
        <ModalBody>
          <Text size='14px' weight={400}>
            <FormattedMessage
              id='modals.upgradeaddresslabels.explain'
              defaultMessage='Upgrading your wallet. This should take around {duration} seconds.'
              values={{ duration: duration }}
            />
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
