import { BSShowModalOriginType } from 'data/types'

export type AddCardVgsProps = {
  handleClose: () => void
  origin?: BSShowModalOriginType
}

export type VgsComponent = React.FC<AddCardVgsProps>
