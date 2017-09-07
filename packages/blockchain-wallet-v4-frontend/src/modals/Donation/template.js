import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, Link, Modal, Text } from 'blockchain-info-components'
import modalEnhancer from 'providers/ModalEnhancer'

const DonationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  width: 100;
`
const Footer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  padding: 5px 0;

  & > * { justify-content: center; }
`

const Donation = (props) => {
  const { handleBack, ...rest } = props

  return (
    <Modal {...rest} icon='send' title='Donate' size='large' nature='primary'>
      <DonationContainer>
        <Text size='14px' color='white' weight={500}>
          <FormattedMessage id='modals.Donation.donate' defaultMessage='See what adding a portion of your transaction will do for those in need.' />
        </Text>
      </DonationContainer>
      <Footer>
        <Button nature='primary' fullwidth uppercase>
          <FormattedMessage id='modals.Donation.send' defaultMessage='Add this donation to my transaction' />
        </Button>
        <Link onClick={handleBack} uppercase size='13px' color='white' weight={300}>
          <FormattedMessage id='modals.Donation.back' defaultMessage='Go back' />
        </Link>
      </Footer>
    </Modal>
  )
}

Donation.propTypes = {
  handleBack: PropTypes.func
}

const enhance = modalEnhancer('Donation')

export default enhance(Donation)
