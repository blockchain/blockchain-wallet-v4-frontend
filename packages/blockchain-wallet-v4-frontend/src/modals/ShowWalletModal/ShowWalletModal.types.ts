import { ModalNameType } from 'data/types'
import { FC } from 'react'

export type ShowWalletModalProps = {
    close?: (name: ModalNameType) => void,
    userClickedOutside?: boolean
    address: string;
}

export type ShowWalletModalComponent = FC<ShowWalletModalProps>
