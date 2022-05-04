import React, { FunctionComponent } from 'react'
import { Route } from 'react-router-dom'
import styled from 'styled-components'

import { Image, Text, TextGroup } from 'blockchain-info-components'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
`
const BlockchainLogoImage = styled(Image)`
  display: block;
  height: 25px;
  width: 200px;
`
const ErrorText = styled(Text)<{ hasHeader?: boolean }>`
  color: white;
  font-weight: 400;
  padding-top: ${({ hasHeader }) => (hasHeader ? '35vh' : '0px')};
`
const BodyText = styled(TextGroup)`
  margin: 0 20px;
  text-align: center;
`

const Error = ({ hasHeader }: { hasHeader?: boolean }) => (
  <Wrapper>
    <Row>
      <BodyText>
        <ErrorText size='18px' hasHeader>
          Sorry for the inconvenience but we&rsquo;re performing some maintenance at the moment.
          We&rsquo;ll be back online soon!
        </ErrorText>
      </BodyText>
    </Row>
    {!hasHeader && (
      <Row style={{ marginTop: '60px' }}>
        <BlockchainLogoImage name='blockchain-logo' />
      </Row>
    )}
  </Wrapper>
)

const Maintenance: FunctionComponent<{ path?: string }> = ({ path }) => {
  document.title = 'Blockchain.com Maintenance'

  if (path) {
    return <Route path={path} render={() => <Error />} />
  }
  return <Error hasHeader />
}

export default Maintenance
