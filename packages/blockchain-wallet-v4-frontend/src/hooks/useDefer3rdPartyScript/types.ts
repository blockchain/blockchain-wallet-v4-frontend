export enum ScriptStatus {
  ERROR = 'error',
  IDLE = 'idle',
  LOADING = 'loading',
  READY = 'ready'
}

export type UseDefer3rdPartyScriptHook = (
  url?: string,
  options?: {
    attributes?: {
      [k: string]: string
    }
  }
) => [boolean, ScriptStatus]
