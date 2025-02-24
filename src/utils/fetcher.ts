// eslint-disable-next-line no-restricted-syntax
export const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  });
