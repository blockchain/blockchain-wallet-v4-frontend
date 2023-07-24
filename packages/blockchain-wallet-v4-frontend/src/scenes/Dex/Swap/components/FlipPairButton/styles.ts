import styled from 'styled-components'

export const Wrapper = styled.div<{ isQuoteLocked: boolean }>`
  position: absolute;
  top: calc(50% - 16px);
  right: calc(50% - 16px);
  height: 32px;
  width: 32px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.white};
  z-index: 99;
  cursor: ${({ isQuoteLocked }) => (isQuoteLocked ? 'not-allowed' : 'pointer')};

  > :nth-child(1) {
    position: relative;
    top: 8px;
    left: 8px;
    z-index: 99 !important;
    cursor: ${({ isQuoteLocked }) => (isQuoteLocked ? 'not-allowed' : 'pointer')};
  }

  &:after {
    content: '';
    display: block;
    position: absolute;
    top: 6px;
    right: 6px;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background-color: ${(props) => props.theme.grey000};
  }
`
