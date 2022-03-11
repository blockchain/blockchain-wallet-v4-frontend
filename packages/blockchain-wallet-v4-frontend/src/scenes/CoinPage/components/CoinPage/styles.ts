import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  column-gap: 32px;
  padding: 40px 64px;
  width: 100%;
  max-width: 1280px;
`

export const ChartWrapper = styled.div`
  height: 400px;
`
