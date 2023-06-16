import {del, get, post, put} from './api_helper';

const api = {
  chats(appId) {
    return get(`chats/${appId}`);
  },
  createChats(data) {
    return post('chats/', data);
  },
};

export default api;
