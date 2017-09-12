import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'

import { Button, ButtonGroup, Text } from 'blockchain-info-components'
import { Form, PasswordBox } from 'components/Form'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  @media(min-width: 992px) {
    align-items: flex-end;
  }

  & > * { padding: 10px 0; }
`
const Settings = (props) => {
  const { handleClick, activityLoggingEnabled } = props
  return (
    <Wrapper>
      <Button nature='secondary' onClick={handleClick}>
        <FormattedMessage id='scenes.security.activityLogging.updateform.removeactivitylogging' defaultMessage={activityLoggingEnabled ? 'Disable' : 'Enable'} />
      </Button>
    </Wrapper>
  )
}

Settings.propTypes = {
  handleClick: PropTypes.func.isRequired
}

export default Settings
