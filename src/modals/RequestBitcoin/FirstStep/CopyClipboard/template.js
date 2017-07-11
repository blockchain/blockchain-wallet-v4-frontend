import React from 'react'
import styled from 'styled-components'
import CopyToClipBoard from 'react-copy-to-clipboard'

import { Text } from 'components/generic/Text'

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
  font-size: 0.8rem;
  background-color: #EFEFEF;

  @media(min-width:768px) { width: 65%; font-size: 0.9rem; }
`
const ButtonContainer = styled.div`
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;

  @media(min-width:768px) { width: 35%; }
`
const CopyButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100%;
  cursor: pointer;
  background-color: ${props => props.active ? '#006600' : '#10ADE4'};

  @media(min-width:768px) { width: 40%; }
`
const QRCodeButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100%;
  cursor: pointer;
  background-color: #004A7C;

  @media(min-width:768px) { width: 60%; }
`

const CopyClipboard = (props) => {
  const { active, address, handleClick, handleClickCode } = props
  return (
    <Wrapper>
      <AddressBox>
        {address}
      </AddressBox>
      <ButtonContainer>
        <CopyToClipBoard text={address} onCopy={handleClick}>
          <CopyButton active={active}>
            { active
              ? <Text id='modals.requestbitcoin.firststep.copyclipboard.copied' text='Copied!' small light white uppercase />
              : <Text id='modals.requestbitcoin.firststep.copyclipboard.copy' text='Copy' small light white uppercase />
            }
          </CopyButton>
        </CopyToClipBoard>
        <QRCodeButton onClick={handleClickCode}>
          <Text id='modals.requestbitcoin.firststep.copyclipboard.qrcode' text='QR Code' small light white />
        </QRCodeButton>
      </ButtonContainer>
    </Wrapper>
  )
}

export default CopyClipboard
