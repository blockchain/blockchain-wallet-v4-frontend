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
  const { handleClick, blockTorIps } = props
  return (
    <Wrapper>
      <Button nature='secondary' onClick={handleClick}>
        {blockTorIps
          ? <FormattedMessage id='scenes.security.tor.allowtorips' defaultMessage='Allow' />
          : <FormattedMessage id='scenes.security.tor.blocktorips' defaultMessage='Block' />
        }
      </Button>
    </Wrapper>
  )
}

Setting.propTypes = {
  handleClick: PropTypes.func.isRequired
}

export default Setting
