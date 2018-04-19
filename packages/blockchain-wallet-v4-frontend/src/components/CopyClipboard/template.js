import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import CopyToClipBoard from 'react-copy-to-clipboard'

import { Button } from 'blockchain-info-components'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  @media(min-width:768px) { flex-direction: row; }
`
const AddressBox = styled.span`
  display: flex;
  width: 100%;
  height: 36px;
  font-size: 16px;
  font-weight: 300;
  overflow: hidden;
  padding-left: 10px;
  align-items: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-family: 'Montserrat', Helvetica, sans-serif;
  background-color: ${props => props.theme['gray-1']};

  @media(min-width:768px) { font-size: 14px; }
`
const CopyButton = styled(Button)`
  width: 100px;
  min-width: 0;
  height: 100%;
  border-radius: 0;
`

const CopyClipboard = (props) => {
  const { active, address, handleClick } = props

  return (
    <Wrapper>
      <AddressBox>
        {address}
      </AddressBox>
      <CopyToClipBoard text={address} onCopy={handleClick}>
        <CopyButton nature={active ? 'copy' : 'secondary'}>
          { active
            ? <FormattedMessage id='components.copyclipboard.copied' defaultMessage='Copied!' />
            : <FormattedMessage id='components.copyclipboard.copy' defaultMessage='Copy' />
          }
        </CopyButton>
      </CopyToClipBoard>
    </Wrapper>
  )
}

CopyClipboard.propTypes = {
  active: PropTypes.bool.isRequired,
  address: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default CopyClipboard
