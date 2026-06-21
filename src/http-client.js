function httpClient(defs) {
  ax.defaults = defs = merge({method:'get', responseType:'text', headers:{accept:'application/json'}}, defs);
  ax.request = ax
  ;['get','delete','options'].map(m => ax[m] = (url, cfg) => ax(url, cfg, m))
  ;['post','put','patch','query'].map(m => ax[m] = (url, data, cfg) => ax(url, cfg, m, data))
  ax.postForm = (url, data, cfg) => ax(url, cfg, 'post', toFormData(data))

  function toFormData(data, formData = new FormData(), parent = '') {
    if (data && typeof data === 'object' && !(data instanceof File) && !(data instanceof Blob)) {
      Object.keys(data).forEach(k => toFormData(data[k], formData, parent ? parent+'['+k+']' : k))
    } else if (data !== null && data !== undefined) {
      formData.append(parent, data)
    }
    return formData
  }

  function merge(x, y, lc) {
    let r = {}, i
    if (Array.isArray(x)) return x.concat(y)
    for (i in x) r[lc ? i.toLowerCase() : i] = x[i]
    for (i in y) {
      const k = lc ? i.toLowerCase() : i
      const v = y[i]
      r[k] = k in r && typeof v == 'object' ? merge(r[k], v, k == 'headers') : v
    }
    return r
  }

  function ax(url, cfg, _method, data) {
    cfg = merge(defs, cfg || {})
    const headers = {}

    if (cfg.auth) headers.authorization = cfg.auth
    if (data && typeof data === 'object' && typeof data.append !== 'function' && typeof data.text !== 'function') {
      data = JSON.stringify(data)
      headers['content-type'] = 'application/json'
    }
    try {
      headers[cfg.xsrfHeaderName] = decodeURIComponent(document.cookie.match(RegExp('(^|; )' + cfg.xsrfCookieName + '=([^;]*)'))[2])
    } catch (e) {}
    if (cfg.baseURL) url = url.replace(/^(?!.*\/\/)\/?/, cfg.baseURL + '/')
    if (cfg.params) url += (url.includes('?') ? '&' : '?') + new URLSearchParams(cfg.params)

    return fetch(url, {
      method: (_method || cfg.method).toUpperCase(),
      body: data,
      headers: merge(cfg.headers, headers, true),
    }).then((res) => {
      const response = {status:res.status, statusText:res.statusText, ok:res.ok, headers:res.headers, config:cfg}
      return res[cfg.responseType]().then((data) => {
        response.data = data
        try {response.data = JSON.parse(data)} catch(e) {}
        if (res.ok) return response

        if (cfg.onError) cfg.onError(response)
        const e = new Error('HTTP ' + res.status)
        e.response = response
        throw e
      })
    })
  }
  return ax
}
