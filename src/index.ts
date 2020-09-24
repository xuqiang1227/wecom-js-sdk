
import { TicketsType, anyObject, getWeComUser, AuthContextType, setAuthContextType, getAuthContextType, registerFetchDataFunction, getParamsForUrl, setCorpCode } from './common';

import { doAuth, getWeComCode, getReferTickets, getReferUser } from './weComAppAuth';

import { getTickets } from './ticketsSessionStorage';

export { openDebug } from './utils';

export {
  TicketsType, anyObject, AuthContextType, setAuthContextType, getAuthContextType, registerFetchDataFunction,
  doAuth, getWeComCode, getReferTickets, getReferUser,
  getTickets, getWeComUser
}

export const weComStart = async (_corpId?: string) => {
  const { corpId, code } = getParamsForUrl() as anyObject;
  if (corpId) {
    getWeComCode({
      appId: _corpId || corpId
    });
  }
  if (code) {
    setCorpCode(code);
    return Promise.all([
      getReferTickets(),
      getReferUser()
    ]);
  }
}