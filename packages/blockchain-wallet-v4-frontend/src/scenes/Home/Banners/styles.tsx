import styled, { css } from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { media } from 'services/styles'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.grey000};

  ${media.atLeastLaptop`
  height: 56px;
  padding: 0 20px;
  align-items: flex-start;
`}

  ${media.mobile`
  flex-direction: column
`}
`

export const ColumnWrapper = styled.div<{ showSpacing?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  ${media.mobile`
  width: 100%;
  margin-top: ${(props) => (props.showSpacing ? '24px' : '0')};
`}
`
export const Column = styled.div<{ hideRow?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;

  ${(props) =>
    !props.hideRow &&
    css`
      flex-direction: column;
    `}

  ${media.mobile`
  flex-direction: column
`}
`
export const Title = styled(Text)`
  color: ${(props) => props.theme.grey800};
  margin-top: 4px;
  margin-right: 8px;
`
export const SubTitle = styled(Text)`
  margin-top: 6px;
`

export const CartridgeContainer = styled.div`
  width: auto;
  margin-right: 14px;
  > span {
    text-transform: uppercase;
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
