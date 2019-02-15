import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: space-around;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 13px;
  text-transform: ;
  color: ${props => props.theme['gray-5']};
`
export const MenuItem = styled.li`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 5px 5px;
  margin-bottom: 8px;
  box-sizing: border-box;
  cursor: pointer;
  font-weight: 300;
  font-size: 15px;
  width: 100%;
  & > *:not(div) {
    cursor: pointer;
    transition: color 0.3s;
    color: ${props => props.theme['gray-5']};
  }
  & > span:first-child {
    width: 30px;
    font-size: 28px;
    margin-right: 10px;
  }

  &.active {
    font-weight: 400;

    & > *:not(div) {
      color: ${props => props.theme['marketing-primary']};
    }
  }

  &:hover {
    & > *:not(div) {
      color: ${props => props.theme['textBlack']};
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
  font-weight: 300;
  font-size: 15px;
  cursor: pointer;

  &.active {
    & > * {
      font-weight: 400;
      color: ${props => props.theme['marketing-primary']};
    }
  }
`
export const Separator = styled.div`
  margin-top: 30px;
`
