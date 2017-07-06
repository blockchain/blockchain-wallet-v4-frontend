import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Modal, ModalHeader, ModalBody } from 'components/generic/Modal'
import { Button } from 'components/legacy/Button'
import TextArea from 'components/generic/TextArea'
import DropdownSearch from 'components/shared/DropdownSearch'
import { Typography } from 'components/generic/Typography'

const RequestBitcoin = (props) => {
  return (
    <Modal isOpen={props.isOpen} size='lg' keyboard>
      <ModalHeader>
        <Typography bigger>
          <i className='icon-send padding-right-10' />
          <FormattedMessage id='components.shared.requestbitcoin.request' defaultMessage='Request' />
        </Typography>
      </ModalHeader>
      <ModalBody>
        <Typography small medium uppercase>
          <FormattedMessage id='components.shared.requestbitcoin.share' defaultMessage='Copy & share address:' />
        </Typography>
        <Typography small medium uppercase>
          <FormattedMessage id='components.shared.requestbitcoin.amount' defaultMessage='Enter amount:' />
        </Typography>
        <Typography small medium uppercase>
          <FormattedMessage id='components.shared.requestbitcoin.to' defaultMessage='Receive to:' />
        </Typography>
        <DropdownSearch items={props.addresses} callback={props.selectAddress} />
        <Typography small medium uppercase>
          <FormattedMessage id='components.shared.requestbitcoin.description' defaultMessage='Description:' />
        </Typography>
        <TextArea placeholder="What's this transaction for?" fullwidth />
        <Button type='secondary' fullwidth>
          <FormattedMessage id='components.shared.requestbitcoin.next' defaultMessage='Next' />
        </Button>
      </ModalBody>
    </Modal>
  )
}

RequestBitcoin.defaultProps = {
  isOpen: false
}

RequestBitcoin.propTypes = {
  isOpen: PropTypes.bool.isRequired
}

export default RequestBitcoin
