import qs from 'qs'
import axios, { Method } from 'axios'
import pathToRegexp from 'path-to-regexp'
import get from 'get-value'

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

export default function request(options: RequestOption) {
  return fetch(options).then(response => {
    const { statusText, status, data } = response
    const code = data ? '' + data.code : '1'

    return {
      success: +code === 200,
      message: data.message || statusText,
      status,
      data: response.data,
    }
  }).catch(error => {
    const { response } = error
    let msg
    let status
    let otherData = {}
    if (response) {
      const { data } = response
      otherData = data
      status = response.status
      // timeout
      if (error.message.includes('timeout')) {
        msg = '请求超时，请稍候重试~'
      } else if (!error.status && !navigator.onLine) {
        // offline
        msg = '网络异常，请检查网络或稍候重试~'
      }
    }

    console.error(msg)

    return Promise.resolve({ success: false, status, message: msg, data: { ...otherData } })
  })
}
