export type ProveProps = {
  location: {
    pathname: string
    search: string
  }
}

export type ProveStates = 'loading' | 'error' | 'verified'
