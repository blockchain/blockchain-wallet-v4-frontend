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

  @media(min-width:768px) { width: 80px; }
`
const CopyButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
  background-color: ${props => props.active ? '#006600' : '#10ADE4'};
`

const CopyClipboard = (props) => {
  const { active, address, handleClick } = props
  return (
    <Wrapper>
      <AddressBox>
        {address}
      </AddressBox>
      <ButtonContainer>
        <CopyToClipBoard text={address} onCopy={handleClick}>
          <CopyButton active={active}>
            { active
              ? <Text id='modals.qrcode.copyclipboard.copied' text='Copied!' small light white uppercase />
              : <Text id='modals.qrcode.copyclipboard.copy' text='Copy' small light white uppercase />
            }
          </CopyButton>
        </CopyToClipBoard>
      </ButtonContainer>
    </Wrapper>
  )
}

export default CopyClipboard
