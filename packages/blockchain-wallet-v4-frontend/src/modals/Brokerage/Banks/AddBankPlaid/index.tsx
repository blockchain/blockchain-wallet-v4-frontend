import React from 'react'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { selectors } from 'data'

const Iframe = styled.iframe`
  border: 0;
  width: 100%;
  height: 100%;
`

const Success: React.FC = () => {
  const {
    data: { api }
  } = useSelector(selectors.core.walletOptions.getDomains)
  const iFrameUrl = useSelector(selectors.components.brokerage.getPlaidWalletHelperLink)
  return <Iframe src={iFrameUrl} />
}

export default Success
