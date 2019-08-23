

const token = localStorage.getItem('token');

const ChatlistSSE = new EventSource('/api/chat/list_retrieval/' + (token));

export { ChatlistSSE }