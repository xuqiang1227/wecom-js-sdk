'use strict';
import { getTickets, setTicketsStorage } from './ticketsSessionStorage';
import { setCorpId, TicketsType, getCorpId, getCorpCode, setWeComUser, getAuthContextType, AuthContextType, setAuthContextType, anyObject, getFetchDataFunction } from './common';

const SHA1 = require('js-sha1');

export const getWeComCode = ({
  appId,
  redirect_uri,
  scope,
}: {
  appId: string;
  redirect_uri?: string;
  scope?: string;
}) => {
  setCorpId(appId);
  const { weComBaseUrl, redirectUrl } = getAuthContextType() as AuthContextType;
  if (!weComBaseUrl) {
    throw new Error('没有配置https://open.weixin.qq.com/connect/oauth2/authorize 地址。');
  }
  redirect_uri = redirect_uri || redirectUrl || window.location.href;
  window.location.href = `${weComBaseUrl}?appid=${appId}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=code&scope=${scope}#wechat_redirect`;
};

export const doAuth = async (jsApiList?: string[]) => {
  const tickets: TicketsType = await getTickets();
  setAuthContextType({ timestamp: Date.now() });
  wxConfig(tickets, jsApiList);
  agentConfig(tickets, jsApiList);
  setTicketsStorage(tickets);
};

const wxConfig = (props: TicketsType, _jsApiList?: string[]) => {
  const { jsApiList = [], timestamp, nonceStr } = getAuthContextType() as AuthContextType;
  _jsApiList = _jsApiList ? _jsApiList.concat(jsApiList) : jsApiList;
  wx.config({
    beta: true,
    debug: !!window.__wxComDebug,
    appId: props.corpId,
    timestamp: timestamp,
    nonceStr: nonceStr,
    signature: signature(props.corpJsapiTicket),
    jsApiList: _jsApiList,
  });
};

const agentConfig = (props: TicketsType, _jsApiList?: string[]) => {
  const { jsApiList = [], timestamp, nonceStr } = getAuthContextType() as AuthContextType;
  _jsApiList = _jsApiList ? _jsApiList.concat(jsApiList) : jsApiList;
  wx.agentConfig({
    corpid: props.corpId,
    agentid: props.agentId,
    timestamp: timestamp,
    nonceStr: nonceStr,
    signature: signature(props.agentJsapiTicket),
    jsApiList: _jsApiList,
  });
};

const signature = (ticket: string) => {
  const url = window.location.href.split('#')[0];
  const { timestamp, nonceStr } = getAuthContextType() as AuthContextType;
  return SHA1(
    `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`,
  );
};

export const getReferTickets = async ()
  : Promise<TicketsType> => {
  const _corpId = getCorpId();
  if (!_corpId) {
    return Promise.reject('corpId is not find!');
  }
  // const res = await request.get(`${FETCH_JSAPI_TICKETS}?corpId=${_corpId}`);
  // const tickets = (res && res.data) || {};
  const { fetchTicket } = getFetchDataFunction();
  const tickets = await fetchTicket(_corpId);
  setTicketsStorage(tickets);
  return tickets;

};

export const getReferUser = async () => {
  const _corpId = getCorpId();
  const code = getCorpCode();
  if (!_corpId || !code) {
    return Promise.reject('corpId or code is not find!');
  }
  // const result = await request.get(url);
  const { fetchUser } = getFetchDataFunction();
  const result = await fetchUser(_corpId, code);
  setWeComUser(result);
  return result;
};
