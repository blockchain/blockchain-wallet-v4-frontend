import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Button } from 'components/generic/Button'
import { Text } from 'components/generic/Text'
import Modal from 'components/generic/Modal'

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
const LogoutButton = styled(Button)`
  background-color: #660000;
  border-color: #660000;
  margin-left: 10px;

  &:hover {
    background-color: #880000;
    border-color: #880000;
  }
`
const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 5px 0;
`

const AutoDisconnection = (props) => {
  const { closeButton, payload, handleClick, handleCancel, ...rest } = props
  const { duration } = payload

  return (
    <Modal {...rest} icon='icon-right_arrow' title='Are you still there?' size='large' closeButton={closeButton}>
      <Container>
        <Text id='modals.autodisconnection.explain' text="You've been inactive for {duration} minutes." values={{duration: duration}} small light />
        <br />
        <Text id='modals.autodisconnection.explain2' text="Click 'Cancel' if you don't want to be logged out automatically." small light />
      </Container>
      <Footer>
        <Button onClick={handleCancel}>
          <Text id='modals.autodisconnection.cancel' text='Cancel' small light />
        </Button>
        <LogoutButton onClick={handleClick}>
          <Text id='modals.autodisconnection.logout' text='Log me out' small light white />
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
