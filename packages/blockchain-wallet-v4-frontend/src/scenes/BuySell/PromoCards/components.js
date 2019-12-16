import { Button } from 'blockchain-info-components'
import styled from 'styled-components'

export const Box = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid ${props => props.theme['grey000']};
  width: 17.5rem;
  height: 15.5rem;
  margin-top: 2rem;

  &:not(:last-child) {
    margin-right: 1.5rem;
  }
`

export const BoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

export const BaseIcon = styled.div`
  background-repeat: no-repeat;
  height: 2rem;
  width: 2rem;
`

export const RoundButton = styled(Button)`
  border-radius: 0.5rem;
`
