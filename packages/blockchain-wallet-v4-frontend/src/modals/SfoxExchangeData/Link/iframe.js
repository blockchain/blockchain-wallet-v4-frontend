import React from 'react'
import styled from 'styled-components'

const ButtonContainer = styled.div`
  margin-bottom: 10px;
`

const plaidStyled = {
  position: 'fixed',
  top: '0px',
  left: '0px',
  right: '0px',
  bottom: '0px',
  display: 'block',
  zIndex: 99999999,
  overflowX: 'hidden',
  overflowY: 'auto',
  height: '100%',
  width: '100%'
}

const iframe = (props) => (
  <ButtonContainer>
    <iframe style={props.enablePlaid ? plaidStyled : { border: 'none', width: '100%', height: '40px' }}
      src={props.plaidUrl}
      sandbox='allow-same-origin allow-scripts allow-forms allow-popups'
      scrolling='no'
      id='plaid'
    />
  </ButtonContainer>
)

export default iframe
