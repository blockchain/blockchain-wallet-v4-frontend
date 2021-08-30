import styled, { css } from 'styled-components'

import { Text } from 'blockchain-info-components'
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
