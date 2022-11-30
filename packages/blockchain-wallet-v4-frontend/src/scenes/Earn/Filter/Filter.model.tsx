import React from 'react'
import styled from 'styled-components'

import { media } from 'services/styles'

export const TabRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  ${media.laptopM`
    flex-direction: column;
    gap: 16px;
  `}
`

export const Column = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;

  & > div {
    width: 100%;
  }
`

export const TextContainer = styled.div`
  min-width: 85px;

  ${media.laptop`
    min-width:60px;
  `}
`

export const LeftContainer = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;

  ${media.laptopM`
    & > div:first-child {
      max-width: 70%;
      width: 100%;
    }
  `}

  ${media.laptop`
    & > div:first-child {
      max-width: 60%;
    }
  `}
`

export const RightContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  width: 100%;

  ${media.laptopM`
    gap: 16px;
    justify-content: flex-start;

    & > div:first-child {
      max-width: 70%;
      width: 100%;
    }

  `}

  ${media.laptop`
    & > div:first-child {
      max-width: 60%;
    }
  `}
`
