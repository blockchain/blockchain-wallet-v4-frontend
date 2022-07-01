import styled from 'styled-components'

import { media } from 'services/styles'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  min-width: 160px;
  padding: 15px 20px 0 20px;
  > div:not(:last-child) {
    margin-bottom: 5px;
  }
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px !important;
  /* caret icon rotation */
  > span:last-child {
    transition: transform 0.3s;
    &.active {
      transform: rotate(90deg);
    }
  }
`

export const HomeBalanceTable = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

export const HomeBalanceRow = styled.div`
  flex: auto;
  display: flex;
  padding: 20px 0;
  flex-direction: column;
  justify-content: center;
  min-height: 40px;
  &:first-child {
    flex: 1;
    display: block;
    padding: 15px 0;
  }
  &:not(:last-child) {
    border-bottom: 1px solid ${(props) => props.theme.grey000};
  }
  ${media.mobile`
    min-height: auto;
    padding: 15px 0px;
  `}
`
