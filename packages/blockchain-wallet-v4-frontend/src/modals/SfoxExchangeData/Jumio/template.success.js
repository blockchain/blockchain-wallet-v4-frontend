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
const JumioFrame = styled.iframe`
  width: 80%;
  height: 450px;
  border-width: 1px;
  border-style: solid;
  border-color: ${props => props.theme['gray-1']};
`
const LinkContainer = styled.div`
  width: 80%;
  margin-top: 5px;
  text-align: right;
`
const Link = styled.span`
  cursor: pointer;
  font-size: 13px;
  text-decoration: underline;
  color: ${props => props.theme['brand-secondary']};
`

const Success = props => {
  const { options, token, onFinish } = props
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
      <LinkContainer>
        <Link onClick={onFinish}>Next</Link>
      </LinkContainer>
    </Container>
  )
}

export default Success
