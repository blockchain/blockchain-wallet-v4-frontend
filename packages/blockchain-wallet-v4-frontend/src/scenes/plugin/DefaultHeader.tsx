import React from 'react'
import styled from 'styled-components'

import { Flex } from 'components/Flex'

const Wrapper = styled(Flex)`
  padding: 17px 24px;
  width: 100%;
`

const PrefixSuffix = styled.div`
  height: 100%;
  width: 24px;

  & * {
    fill: ${(p) => p.theme.white};
  }
`

const DefaultHeader = ({
  children,
  onPrefixClick,
  onSuffixClick,
  prefix,
  suffix
}: {
  children?: JSX.Element
  onPrefixClick?: () => void
  onSuffixClick?: () => void
  prefix?: JSX.Element
  suffix?: JSX.Element
}) => {
  return (
    <Wrapper justifyContent='space-between'>
      <PrefixSuffix onClick={onPrefixClick}>{prefix}</PrefixSuffix>
      {children}
      <PrefixSuffix onClick={onSuffixClick}>{suffix}</PrefixSuffix>
    </Wrapper>
  )
}

export default DefaultHeader
