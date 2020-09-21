import { TicketsType } from './common';
import { getReferTickets } from './weComAppAuth';

const sessionId = 'wx-tickets';
let ticketsTimeId: NodeJS.Timer;
const timeout = 7200 * 1000;

export const setTicketsStorage = (tickets: TicketsType) => {
  sessionStorage.setItem(sessionId, JSON.stringify(tickets));
  ticketsTimeId = setTimeout(() => {
    sessionStorage.removeItem(sessionId);
    if (ticketsTimeId) {
      window.clearTimeout(ticketsTimeId);
    }
  }, timeout);
};

export const getTickets = async (): Promise<TicketsType> => {
  return new Promise((resolve, reject) => {
    const tickets: TicketsType | null = sessionStorage.getItem(sessionId)
      ? JSON.parse(sessionStorage.getItem(sessionId)!)
      : null;
    if (!tickets) {
      const tickets = getReferTickets();
      return resolve(tickets);
    }
    return resolve(tickets);
  });
};
