import React from 'react'
import styled from 'styled-components'

import { FlyoutWrapper } from 'components/Flyout'

const Wrapper = styled(FlyoutWrapper)`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  text-align: center;
`

const renderError = (code: number) => {
  switch (code) {
    default:
      return <>code</>
  }
}

const Failure = ({ code }: Props) => {
  return <Wrapper>{renderError(code)}</Wrapper>
}

type Props = { code: number }

export default Failure
