import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  justify-content: center;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  column-gap: 32px;
  padding: 40px 64px;
  width: 100%;
  max-width: 1280px;
`
