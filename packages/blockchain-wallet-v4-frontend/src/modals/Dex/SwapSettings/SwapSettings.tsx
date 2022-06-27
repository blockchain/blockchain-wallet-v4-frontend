import React from 'react'

import { Modal, Text } from 'blockchain-info-components'
import { ModalName } from 'data/modals/types'
import modalEnhancer from 'providers/ModalEnhancer'

export const DexSwapSettings = ({ position, total }) => (
  <Modal size='medium' position={position} total={total}>
    <Text size='20px'>Swap Settings</Text>
  </Modal>
)

export default modalEnhancer(ModalName.DEX_SWAP_SETTINGS)(DexSwapSettings)
