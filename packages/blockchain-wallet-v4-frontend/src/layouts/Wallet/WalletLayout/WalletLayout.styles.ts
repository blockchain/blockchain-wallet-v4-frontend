import styled, { css } from 'styled-components'

import { media } from 'services/styles'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`
const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  overflow-y: auto;
`
const Nav = styled.div`
  flex: 0 0 60px;
  background-color: ${(props) => props.theme.white};
`
const Content = styled.div<{ center?: boolean; removeContentPadding?: boolean }>`
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: calc(100% - 250px);
  max-width: calc(100% - 250px);
  ${({ center }) =>
    center &&
    css`
      width: 100%;
      max-width: 100%;
      justify-content: center;
    `}
  background-color: ${(props) => props.theme.white};
  ${({ removeContentPadding }) => (removeContentPadding ? '' : 'padding: 32px 28px 16px 36px;')}
  ${media.tablet`
    padding: 8px 16px;
    width: 100%;
    max-width: 100%;
  `}
  ${media.mobile`
    padding: 8px 16px;
    width: 100%;
    max-width: 100%;
  `}
`

export { Container, Content, Nav, Wrapper }
