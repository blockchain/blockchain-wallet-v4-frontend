import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { media } from 'services/styles'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${(props) => props.theme.grey000};
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;

  ${media.atLeastLaptop`
    height: 80px;
    padding: 0 20px;
  `}

  ${media.mobile`
    padding: 12px;
    flex-direction: column;
  `}
`

export const Column = styled.div`
  display: flex;
  flex-direction: column;

  & > div:first-child {
    margin-bottom: 0.25rem;
  }
`

export const Row = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`

export const Copy = styled(Text)`
  display: flex;
  align-items: center;
  ${media.mobile`
    font-size: 12px;
  `}
  ${media.tablet`
    font-size: 14px;
  `}
`

export const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  min-width: 40px;
  border-radius: 20px;
  margin-right: 20px;
`

export const PendingIconWrapper = styled(IconWrapper)`
  background-color: ${(props) => props.theme.orange000};
`

export const SyncIconWrapper = styled(IconWrapper)`
  background-color: ${(props) => props.theme.blue100};
`

export const BannerButton = styled(Button)`
  height: 48px;
  ${media.mobile`
    font-size: 14px;
    margin-top: 16px;
    padding: 10px;
  `}
`

export const CloseLink = styled.div`
  margin-left: 24px;
  cursor: pointer;
`
