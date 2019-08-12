import querystring from 'querystring';

interface Props {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: { id?: number; title?: string; start?: number; end?: number };
  callback?: Function;
  qs?: {
    start: number;
    end: number;
  };
}

const baseUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:8098';

export default {
  fetch: ({ method, body, callback, qs }: Props) => {
    const queries = qs ? `${querystring.stringify(qs)}` : '';
    fetch(`${baseUrl}/events?${queries}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then(response => response.json())
      .then(body => {
        if (body.error) {
          alert(body.error);
        } else {
          if (callback) callback(body);
        }
      })
      .catch(error => alert(error.message));
  },
};
