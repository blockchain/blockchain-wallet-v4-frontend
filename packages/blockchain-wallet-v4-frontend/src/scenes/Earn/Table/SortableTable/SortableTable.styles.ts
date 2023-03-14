import { PaletteColors, TableContainer as Table } from '@blockchain-com/constellation'
import styled from 'styled-components'

export const TableContainer = styled(Table)`
  width: 100%;
  border-color: ${PaletteColors['grey-000']} !important;
  margin-bottom: 40px !important;

  & > thead > tr {
    background-color: ${PaletteColors['grey-000']} !important;
  }
`
export const ButtonContainer = styled.div`
  min-width: 76px;
`
