import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, Modal } from 'blockchain-info-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-content: flex-start;
  width: 100%;
  height: 100px;
  padding: 30px 0;
  border-bottom: 1px solid EFEFEF;
`
const LogoutButton = styled.div`
  background-color: #660000;
  border-color: #660000;
  margin-left: 10px;
  color: #FFFFFF;

  &:hover {
    background-color: #880000;
    border-color: #880000;
    color: #FFFFFF;
  }
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
        <FormattedMessage id='modals.autodisconnection.explain' defaultMessage="You've been inactive for {duration} minutes." values={{duration: duration}} />
        <br />
        <FormattedMessage id='modals.autodisconnection.explain2' defaultMessage="Click 'Cancel' if you don't want to be logged out automatically." />
      </Container>
      <Footer>
        <Button onClick={handleCancel}>
          <FormattedMessage id='modals.autodisconnection.cancel' defaultMessage='Cancel' />
        </Button>
        <LogoutButton onClick={handleClick}>
          <FormattedMessage id='modals.autodisconnection.logout' defaultMessage='Log me out' />
        </LogoutButton>
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
