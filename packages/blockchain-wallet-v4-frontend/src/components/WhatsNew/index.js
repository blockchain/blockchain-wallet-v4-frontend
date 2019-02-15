import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 90%;
  height: auto;
  border: 1px solid ${props => props.theme['gray-1']};
  padding: 25px;
  margin-bottom: 25px;
  border-radius: 5px;
`
export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 15px;
  margin-bottom: ${props => props.marginBottom};

  & > :not(:last-child) {
    margin-right: 10px;
  }
`
