import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  min-width: 160px;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`

export const CoinBalanceWrapper = styled.div`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  font-size: ${props => (props.large ? '20px' : '12px')};
  font-weight: ${props => (props.large ? '200' : '300')};
  padding-right: ${props => (props.large ? '15px' : '0px')};
  > div:last-child {
    margin-left: 10px;
    > div {
      color: ${props => props.theme['gray-3']};
    }
  }
`
