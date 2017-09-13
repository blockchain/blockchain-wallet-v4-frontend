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
  const { handleClick, ipLockOn } = props
  return (
    <Wrapper>
      <Button nature='secondary' onClick={handleClick}>
        {ipLockOn
          ? <FormattedMessage id='scenes.security.iprestriction.disable' defaultMessage='Disable' />
          : <FormattedMessage id='scenes.security.iprestriction.enable' defaultMessage='Enable' />
        }
      </Button>
    </Wrapper>
  )
}

Setting.propTypes = {
  handleClick: PropTypes.func.isRequired
}

export default Setting
