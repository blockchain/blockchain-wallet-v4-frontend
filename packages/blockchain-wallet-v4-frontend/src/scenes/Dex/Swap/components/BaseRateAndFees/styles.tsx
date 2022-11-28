import React from 'react'
import { Flex } from '@blockchain-com/constellation'
import styled from 'styled-components'

const WrapperStyled = styled(Flex)`
  margin: 24px 16px;
`

const GasFeeWrapperStyled = styled(Flex)`
  height: 20px;
  padding: 4px 8px;
  margin-right: 8px;

  border-radius: 4px;
  background-color: ${(props) => props.theme.grey000};

  > :first-child {
    margin-right: 6px;
  }
`

const ShowDetailsWrapperStyled = styled(Flex)`
  &:hover {
    cursor: pointer;
  }
`

export const Wrapper = ({ children, ...props }: React.ComponentProps<typeof WrapperStyled>) => (
  <WrapperStyled {...props} alignItems='center' justifyContent='space-between'>
    {children}
  </WrapperStyled>
)

export const GasFeeWrapper = ({
  children,
  ...props
}: React.ComponentProps<typeof WrapperStyled>) => (
  <GasFeeWrapperStyled {...props} alignItems='center' justifyContent='space-between'>
    {children}
  </GasFeeWrapperStyled>
)

export const ShowDetailsWrapper = ({
  children,
  ...props
}: React.ComponentProps<typeof WrapperStyled>) => (
  <ShowDetailsWrapperStyled {...props} alignItems='center'>
    {children}
  </ShowDetailsWrapperStyled>
)
