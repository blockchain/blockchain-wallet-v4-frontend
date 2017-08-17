import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import CopyToClipBoard from 'react-copy-to-clipboard'

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
  font-size: 1rem;
  background-color: #EFEFEF;

  @media(min-width:768px) { font-size: 0.9rem; }
`
const ButtonContainer = styled.div`
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;

  @media(min-width:768px) { width: 180px; }
`
const CopyButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100%;
  cursor: pointer;
  background-color: ${props => props.active ? '#006600' : '#10ADE4'};

  @media(min-width:768px) { width: 80px; }
`
const QRCodeButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100%;
  cursor: pointer;
  background-color: #004A7C;

  @media(min-width:768px) { width: 100px; }
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
              ? <FormattedMessage id='modals.requestbitcoin.firststep.copyclipboard.copied' defaultMessage='Copied!' />
              : <FormattedMessage id='modals.requestbitcoin.firststep.copyclipboard.copy' defaultMessage='Copy' />
            }
          </CopyButton>
        </CopyToClipBoard>
        <QRCodeButton onClick={handleClickCode}>
          <FormattedMessage id='modals.requestbitcoin.firststep.copyclipboard.qrcode' defaultMessage='QR Code' />
        </QRCodeButton>
      </ButtonContainer>
    </Wrapper>
  )
}

export default CopyClipboard
