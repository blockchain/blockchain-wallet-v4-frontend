import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button } from 'blockchain-info-components'

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
const Setting = (props) => {
  const { handleClick, activityLoggingEnabled } = props
  return (
    <Wrapper>
      <Button nature='secondary' onClick={handleClick}>
        {activityLoggingEnabled
          ? <FormattedMessage id='scenes.security.activityLogging.disableactivitylogging' defaultMessage='Disable' />
          : <FormattedMessage id='scenes.security.activityLogging.enableactivitylogging' defaultMessage='Enable' />
        }
      </Button>
    </Wrapper>
  )
}

Setting.propTypes = {
  handleClick: PropTypes.func.isRequired
}

export default Setting
