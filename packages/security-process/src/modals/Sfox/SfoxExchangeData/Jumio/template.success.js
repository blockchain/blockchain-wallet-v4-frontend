import React from 'react'
import styled from 'styled-components'
import { path } from 'ramda'

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`
const JumioFrame = styled.iframe.attrs({
  allow: 'camera'
})`
  width: 100%;
  height: 450px;
  border-width: 1px;
  border-style: solid;
  border-color: ${props => props.theme['gray-1']};
`

const Success = props => {
  const { options, token } = props
  const { authorizationToken } = token
  const walletHelperRoot = path(['domains', 'walletHelper'], options)
  const jumioUrl = `${walletHelperRoot}/wallet-helper/jumio/#/key/${authorizationToken}`

  return (
    <Container>
      <JumioFrame src={jumioUrl} scrolling='yes' id='jumio' />
    </Container>
  )
}

export default Success
