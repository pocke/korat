import { updateUnreadCountAction } from './ActionCreator';
import { Store } from './Store';

const URL = 'ws://localhost:5427/ws';

interface WsMessageUnreadCount {
  Type: 'UnreadCount';
  Payload: {
    ChannelID: number;
    Count: number;
  };
}

type WsMessage = WsMessageUnreadCount;

export const wsOpen = () => {
  const socket = new WebSocket(URL);
  socket.addEventListener('message', event => {
    const data = JSON.parse(event.data) as WsMessage;
    console.log('ws received', data);
    if (data.Type === 'UnreadCount') {
      Store.dispatch(updateUnreadCountAction(data.Payload.ChannelID, data.Payload.Count));
    } else {
      throw 'unreachable';
    }
  });
  socket.addEventListener('close', _event => {
    console.log('ws closed');
    setTimeout(() => wsOpen(), 3000);
  });
};
