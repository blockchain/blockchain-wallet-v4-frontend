import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { media } from 'services/styles'

export const TabRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;

  ${media.laptopL`
    flex-direction: column;
    gap: 16px;
  `}
`

export const Column = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  width: 100%;

  & > div {
    width: 100%;
  }

  & > span {
    min-width: 172px;
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

  & > span {
    min-width: 172px;
  }

  ${media.laptopL`
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

  ${media.laptopL`
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

export const tabs = [
  {
    key: 'All',
    titleContent: (
      <TextContainer>
        <FormattedMessage id='scenes.earn.filter.all-rewards' defaultMessage='All Rewards' />
      </TextContainer>
    )
  },
  {
    key: 'Passive',
    titleContent: (
      <TextContainer>
        <FormattedMessage id='copy.Passive' defaultMessage='Passive' />
      </TextContainer>
    )
  },
  {
    key: 'Staking',
    titleContent: (
      <TextContainer>
        <FormattedMessage id='copy.staking' defaultMessage='Staking' />
      </TextContainer>
    )
  },
  {
    key: 'Active',
    titleContent: (
      <TextContainer>
        <FormattedMessage id='copy.active' defaultMessage='Active' />
      </TextContainer>
    )
  }
]
