import React from 'react'
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
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;
  font-size: 16px;
  background-color: #EFEFEF;

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
            ? <FormattedMessage id='modals.qrcode.copyclipboard.copied' defaultMessage='Copied!' />
            : <FormattedMessage id='modals.qrcode.copyclipboard.copy' defaultMessage='Copy' />
          }
        </CopyButton>
      </CopyToClipBoard>
    </Wrapper>
  )
}

export default CopyClipboard
