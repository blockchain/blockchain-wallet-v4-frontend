import React from 'react'
import styled from 'styled-components'
import { path } from 'ramda'

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const JumioFrame = styled.iframe`
  width: 80%;
  height: 450px;
  border-width: 1px;
  border-style: solid;
  border-color: ${props => props.theme['gray-1']};
`

const Success = value => {
  const { options, token } = value
  const { authorizationToken } = token
  const walletHelperRoot = path(['domains', 'walletHelper'], options)
  const jumioUrl = `${walletHelperRoot}/wallet-helper/jumio/#/key/${authorizationToken}`

  return (
    <Container>
      <JumioFrame
        src={jumioUrl}
        sandbox='allow-same-origin allow-scripts allow-forms allow-popups'
        scrolling='yes'
        id='jumio'
      />
    </Container>
  )
}

export default Success
