import queryString from 'query-string'

export const cError = async (fn: Promise<any>): Promise<[null | { msg: string, code: number | string }, any]> => {
  try {
    const result = await fn
    return [null, result]
  } catch (error) {
    return [error, error]
  }
}

export const getQuery = (): { [key: string]: any } => queryString.parse(location.search)


export const delay = (timeout: number): Promise<void> => new Promise((resolve) => {
  setTimeout(resolve, timeout)
})
