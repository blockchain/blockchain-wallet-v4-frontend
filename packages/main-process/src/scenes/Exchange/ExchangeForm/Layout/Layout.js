import styled from 'styled-components'

export const Cell = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${props => (props.center ? 'center' : 'flex-start')};
  width: ${props => (props.size === 'small' ? '10%' : '45%')};
  height: 100%;
`

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  box-sizing: border-box;
  align-items: center;
  padding: 32px;
  width: 100%;
`
