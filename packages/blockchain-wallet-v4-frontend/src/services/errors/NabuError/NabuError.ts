import { NabuErrorAction, NabuErrorIconProps, NabuErrorProps } from './NabuError.types'

class NabuError extends Error {
  title: string

  icon?: NabuErrorIconProps

  message: string

  actions?: NabuErrorAction[]

  constructor({ actions, icon, message, title }: NabuErrorProps) {
    super(title)

    this.title = title
    this.message = message
    this.icon = icon
    this.actions = actions
  }
}

export default NabuError
