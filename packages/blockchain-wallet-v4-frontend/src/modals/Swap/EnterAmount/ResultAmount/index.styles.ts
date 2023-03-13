import styled from 'styled-components'

export const Text = styled.span`
  transition: 200ms opacity ease-in-out;
`

export const SpinnerWrapper = styled.div`
  transition: 300ms opacity;
  margin-left: 8px;
`

export const Wrapper = styled.div<{ isRefreshing: boolean }>`
  display: flex;
  align-items: center;

  ${Text} {
    opacity: ${(props) => (props.isRefreshing ? 0.5 : 1)};
  }

  ${SpinnerWrapper} {
    opacity: ${(props) => (props.isRefreshing ? 1 : 0)};
    transition-delay: ${(props) => (props.isRefreshing ? '2000ms' : 'unset')};
  }
`
