type NabuErrorAction = {
  title: string
  url?: string
}

type NabuErrorIconProps = {
  accessibility?: {
    description: string
  }
  status?: {
    url: string
  }
  url: string
}

type NabuErrorProps = {
  actions?: NabuErrorAction[]
  categories?: string[]
  dataFields?: { [key: string]: unknown }
  icon?: NabuErrorIconProps
  id?: string
  message: string
  title: string
}

export type { NabuErrorAction, NabuErrorIconProps, NabuErrorProps }
