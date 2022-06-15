import { NabuErrorIconProps, NabuErrorProps } from './NabuError.types'

class NabuError extends Error {
  title: string

  icon?: NabuErrorIconProps

  message: string

  constructor({ icon, message, title }: NabuErrorProps) {
    super(title)

    this.title = title
    this.message = message
    this.icon = icon
  }
}

export default NabuError
