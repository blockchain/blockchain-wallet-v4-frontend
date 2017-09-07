import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Link, Modal, Text, Tooltip } from 'blockchain-info-components'
import modalEnhancer from 'providers/ModalEnhancer'

const DonationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  width: 100;
  padding: 30px 0;
`
const Footer = styled.div`
  padding: 5px 0;
`
const Aligned = styled.div`
& > * { display: inline-block; margin-right: 5px; }
`

const Donation = (props) => {
  const { handleBack, ...rest } = props

  return (
    <Modal {...rest} icon='send' title='Donation' size='large'>
      <Aligned>
        <Text size='14px' weight={500} capitalize>
          <FormattedMessage id='modals.Donation.donate' defaultMessage='Donate to a charity' />
        </Text>
        <Tooltip>
          <FormattedMessage id='modals.Donation.tooltip' defaultMessage='The charity will receive this amount from you.' />
        </Tooltip>
      </Aligned>
      <DonationContainer>
        <Text size='14px' weight={500} capitalize>
          <FormattedMessage id='modals.Donation.donate' defaultMessage='Donate to a charity' />
        </Text>
      </DonationContainer>
      <Footer>
        <Link onClick={handleBack} size='13px' weight={300}>
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
