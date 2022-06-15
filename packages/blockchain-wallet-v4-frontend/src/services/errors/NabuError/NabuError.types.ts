type NabuErrorIconProps = {
  accessibility: {
    description: string
  }
  status: {
    url: string
  }
  url: string
}

type NabuErrorProps = {
  icon?: NabuErrorIconProps
  message: string
  title: string
}

export type { NabuErrorIconProps, NabuErrorProps }
