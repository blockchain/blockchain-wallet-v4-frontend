import styled from 'styled-components'

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

export * from './Home'
export * from './Lockbox'
