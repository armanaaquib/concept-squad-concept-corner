const jsonParser = (res) => {
  if (res.status === 200) {
    return res.json();
  }
};

const postJSONReq = (url, body) => {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const getReq = (url) => {
  return fetch(url);
};
