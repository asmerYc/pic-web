import axios, { AxiosRequestConfig } from 'axios';
import { Observable, of } from 'rxjs'
import { catchError, take, tap } from 'rxjs/operators'
import { ServerRes } from './types';

var debug = require('debug/dist/debug')

export interface QueryParams { [param: string]: string | string[] }
export type QueryMethod = 'get' | 'post' | 'put' | 'delete'
export type ResType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'

// axios.defaults.baseURL = ''
axios.defaults.headers = {
  'X-Requested-With': 'XMLHttpRequest',
}

export function axiosRx<T>(
  config: AxiosRequestConfig
): Observable<ServerRes<T>> {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()
  const rxReq = new Observable<ServerRes<T>>(observer => {
    axios({
      ...config,
      cancelToken: source.token,
    })
      .then(res => observer.next(res.data))
      .catch((e: Error) => observer.error(e))
    return {
      unsubscribe: () => source.cancel()
    }
  })

  return rxReq.pipe(
    catchError(e => of(getNetErrRes(e))),
    tap(res => {
      if (res.code === -9) {
        location.href = res.data + ''
      }
    })
  )
}

export function axiosEr<T>(
  config: AxiosRequestConfig
): Promise<ServerRes<T>> {
  const axReq = axios.request<ServerRes<T>>(config)
    .then(res => res.data)

  return (
    axReq.catch(e => getNetErrRes(e))
      .then(res => {
        if (res.code === -9) {
          location.href = res.data
        }
        return res
      })
  )
}

export function beforeDestroyRx(this: any): Observable<any> {
  return this.$eventToObservable('hook:beforeDestroy').pipe(
    take(1)
  )
}

function getNetErrRes(e: Error): ServerRes {
  DebugLog(e)
  return (
    {
      code: -8,
      message: `网络错误`,
      data: null
    }
  )
}

if (process.env.VUE_APP_ENV === 'development') {
  localStorage.setItem('debug', 'union*')
} else {
  localStorage.removeItem('debug')
}

export const DebugPromiseReject = debug('union_Promise_reject:')
export const DebugError = debug('union_Error:')
export const DebugLog = debug('union_Log:')