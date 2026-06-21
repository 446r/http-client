# http-client

axios like lightweight http client in 2.5kb.

axios風 軽量httpクライアント（2.5kb）

## Features

- Exclusively for web browsers. ウェブブラウザ向け限定
- Built on top of the native Fetch API. fetchのみ対応
- Zero-dependency, pure JavaScript library. 依存関係なしピュアJavaScript
- Axios-inspired syntax. axios風
- CSRF protection. CSRF対応
- Support for FormData submissions (`postForm`). postForm対応
- Centralized error handling. 共通エラー処理対応


## Usage - 使い方

```
const axios = httpClient({
    xsrfHeaderName:'X-XSRF-TOKEN',
    xsrfCookieName:'XSRF-TOKEN',
    onError: (r) => { /* error handling */ },
})

axios.get('https://example.com/?query=123') .then(r => console.log(r))

axios.post('https://example.com/endpoint', {
    abc:123,
    def:'test',
}).then(r => console.log(r)).catch(e => console.log(e))
```

