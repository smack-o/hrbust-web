import qs from 'qs'
import axios, { Method } from 'axios'
import pathToRegexp from 'path-to-regexp'

export type RequestOption = {
    method?: Method,
    data?: any,
    baseURL?: string,
    timeout?: number,
    url: string,
}

const fetch = async (options: RequestOption) => {
  const {
    method = 'get',
    data,
    baseURL = '/',
    timeout = 20000,
  } = options
  let { url } = options

  axios.defaults.baseURL = baseURL

  const cloneData = {
    ...data,
  }

  try {
    let domin = ''
    const matching = url.match(/[a-zA-z]+:\/\/[^/]*/)
    if (matching) {
      domin = matching[0]
      url = url.slice(domin.length)
    }

    const match = pathToRegexp.parse(url)
    url = pathToRegexp.compile(url)(data)
    for (const item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domin + url
  } catch (e) {
    console.error(e.message)
  }

  const requestOptions = {
    timeout,
    withCredentials: true,
    // crossdomain: true
  }

  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: cloneData,
        paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
        ...requestOptions,
      })
    case 'delete':
      return axios.delete(url, {
        data: cloneData,
        ...requestOptions,
      })
    case 'post':
      return axios.post(url, cloneData, requestOptions)
    case 'put':
      return axios.put(url, cloneData, requestOptions)
    case 'patch':
      return axios.patch(url, cloneData, requestOptions)
    default:
      return axios(options)
  }
}

export default fetch
