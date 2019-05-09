import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: space-around;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-weight: 500;
  color: ${props => props.theme['gray-4']};
`
export const MenuItem = styled.li`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 8px 5px;
  margin-bottom: 8px;
  box-sizing: border-box;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  width: 100%;
  & > *:not(div) {
    cursor: pointer;
    transition: color 0.3s;
    color: ${props => props.theme['gray-7']};
  }
  &:hover {
    & > *:not(div) {
      color: ${props => props.theme['blue']};
    }
  }
  & > span:first-child {
    width: 30px;
    margin-right: 10px;
  }
  &.active {
    font-weight: 500;
    & > *:not(div) {
      color: ${props => props.theme['blue']};
    }
  }
`
export const SubMenu = styled.ul`
  width: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  list-style: none;
  text-transform: none;
  padding: 5px;
  margin-left: 40px;
  margin-top: -15px;
  margin-bottom: 5px;
`
export const SubMenuItem = styled.li`
  padding: 4px 0;
  box-sizing: border-box;
  text-transform: none;
  font-weight: 400;
  font-size: 14px;
  cursor: pointer;

  &.active {
    & > * {
      font-weight: 500;
      color: ${props => props.theme['blue']};
    }
  }

  &:hover {
    & > * {
      color: ${props => props.theme['blue']};
    }
  }
`
export const Separator = styled.div`
  margin: 8px 0 14px 6px;
  width: 20px;
  height: 1px;
  background-color: #ccd2de;
`
