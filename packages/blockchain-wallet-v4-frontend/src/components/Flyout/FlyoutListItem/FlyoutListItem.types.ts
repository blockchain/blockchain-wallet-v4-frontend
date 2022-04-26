import { FC, ReactNode } from "react"

export type FlyoutListItemProps = {
    children?: never
    icon: ReactNode
    endIcon?: ReactNode
    title: ReactNode
    subtitle?: ReactNode
    onClick?: () => null
}

export type FlyoutListItemComponent = FC<FlyoutListItemProps>