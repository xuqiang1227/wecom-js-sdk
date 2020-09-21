import queryString from 'querystring';
export interface TicketsType {
  agentId: string;
  agentJsapiTicket: string;
  corpId: string;
  corpJsapiTicket: string;
}

let corpId: string;
export const setCorpId = (_corpId: string) => {
  corpId = _corpId;
  sessionStorage.setItem('corpId', _corpId);
};

export const getCorpId = () => {
  return corpId || sessionStorage.getItem('corpId');
};

let corpCode: string;
export const setCorpCode = (code: string) => {
  corpCode = code;
  sessionStorage.setItem('corpCode', code);
};
export const getCorpCode = () => {
  return corpCode || sessionStorage.getItem('corpCode');
};

let weComUser: anyObject;
export const setWeComUser = (user: anyObject) => {
  weComUser = user;
  sessionStorage.setItem('weComUser', JSON.stringify(user));
};
export const getWeComUser = () => {
  return weComUser || sessionStorage.getItem('weComUser');
};

export interface anyObject {
  [key: string]: any
}

const WECOM_BASE_PATH = 'https://open.weixin.qq.com/connect/oauth2/authorize';
const SIG_KEY = '@_weCom_js_sdk_app';
const TIMESTAMP = Date.now();
const JS_API_LIST = ['invoke'];

export interface AuthContextType {
  weComBaseUrl?: string;
  redirectUrl?: string; // window.location.href
  authScope?: 'snsapi_base' | 'snsapi_userinfo' | 'snsapi_privateinfo';
  nonceStr?: string;
  timestamp?: number;
  jsApiList?: string[];
}

const AuthContextTypeId = 'AuthContextType';
let AuthContextType: AuthContextType =
  Object.assign({
    weComBaseUrl: WECOM_BASE_PATH,
    redirectUrl: window.location.href,
    authScope: 'snsapi_userinfo',
    nonceStr: SIG_KEY,
    timestamp: TIMESTAMP,
    jsApiList: JS_API_LIST
  }, JSON.parse(sessionStorage.getItem(AuthContextTypeId) || "{}"));

export const setAuthContextType = (props: AuthContextType) => {
  AuthContextType = Object.assign({}, AuthContextType, props);
  sessionStorage.setItem(AuthContextTypeId, JSON.stringify(AuthContextType));
}

export const getAuthContextType = (key?: keyof AuthContextType) => {
  if (key) {
    return AuthContextType[key];
  }
  return AuthContextType;
}

export interface FetchDataFunctionType {
  fetchTicket: (corpId: string) => Promise<TicketsType>;
  fetchUser: (corpId: string, code: string) => Promise<anyObject>;
}

let fetchDataFunction: FetchDataFunctionType;

export const registerFetchDataFunction = (props: FetchDataFunctionType) => {
  fetchDataFunction.fetchTicket = props.fetchTicket;
  fetchDataFunction.fetchUser = props.fetchUser;
}

export const getFetchDataFunction = () => {
  return fetchDataFunction;
}

export const getParamsForUrl = (param?: string, url?: string) => {
  let search = window.location.search;
  if (url) {
    search = url.split('?')[1] || url;
  }
  const params = queryString.parse(search.replace(/\?/g, ''));
  if (param) {
    return params[param];
  }
  return params;
};