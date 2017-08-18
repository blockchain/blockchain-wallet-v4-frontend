import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import CopyToClipBoard from 'react-copy-to-clipboard'

import { Button } from 'blockchain-info-components'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  @media(min-width:768px) { flex-direction: row; }
`
const Address = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;
  font-size: 1rem;
  background-color: #EFEFEF;

  @media(min-width:768px) { font-size: 0.9rem; }
`
const Buttons = styled.div`
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;

  @media(min-width:768px) { width: 200px; }
`
const MenuButton = styled(Button)`
  width: 50%;
  height: 100%;
  border-radius: 0;
`

const CopyClipboard = (props) => {
  const { active, address, handleClick, handleClickCode } = props
  return (
    <Wrapper>
      <Address>{address}</Address>
      <Buttons>
        <CopyToClipBoard text={address} onCopy={handleClick}>
          <MenuButton nature={active ? 'copy' : 'secondary'}>
            { active
              ? <FormattedMessage id='modals.requestbitcoin.firststep.copyclipboard.copied' defaultMessage='Copied!' />
              : <FormattedMessage id='modals.requestbitcoin.firststep.copyclipboard.copy' defaultMessage='Copy' />
            }
          </MenuButton>
        </CopyToClipBoard>
        <MenuButton nature='primary' onClick={handleClickCode}>
          <FormattedMessage id='modals.requestbitcoin.firststep.copyclipboard.qrcode' defaultMessage='QR Code' />
        </MenuButton>
      </Buttons>
    </Wrapper>
  )
}

export default CopyClipboard
