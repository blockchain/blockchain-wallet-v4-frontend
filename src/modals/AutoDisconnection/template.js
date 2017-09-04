import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, Modal, Text } from 'blockchain-info-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-content: flex-start;
  width: 100%;
  height: 100px;
  padding: 30px 0;
  border-bottom: 1px solid ${props => props.theme['bordergrey']};
`
const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 5px 0;
`

const AutoDisconnection = (props) => {
  const { closeButton, duration, handleClick, handleCancel, ...rest } = props

  return (
    <Modal {...rest} icon='right_arrow' title='Are you still there?' size='large' closeButton={closeButton}>
      <Container>
        <Text size='14px' weight={300}>
          <FormattedMessage id='modals.autodisconnection.explain' defaultMessage="You've been inactive for {duration} minutes." values={{duration: duration}} />
        </Text>
        <br />
        <Text size='14px' weight={300}>
          <FormattedMessage id='modals.autodisconnection.explain2' defaultMessage="Click 'Cancel' if you don't want to be logged out automatically." />
        </Text>
      </Container>
      <Footer>
        <Button onClick={handleCancel}>
          <FormattedMessage id='modals.autodisconnection.cancel' defaultMessage='Cancel' />
        </Button>
        <Button nature='logout' onClick={handleClick}>
          <FormattedMessage id='modals.autodisconnection.logout' defaultMessage='Log me out' />
        </Button>
      </Footer>
    </Modal>
  )
}

AutoDisconnection.defaultProps = {
  show: false
}

AutoDisconnection.propTypes = {
  show: PropTypes.bool.isRequired,
  payload: PropTypes.shape({
    duration: PropTypes.number.isRequired,
    handleCancel: PropTypes.func,
    handleClick: PropTypes.func
  })
}

export default AutoDisconnection
