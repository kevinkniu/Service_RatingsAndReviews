import http from 'k6/http';
import { sleep, check, group } from 'k6';

export const options = {
  stages: [
    { duration: '15s', target: 3 },
    { duration: '10s', target: 0 },
  ],
};

export default function () {
  group('GET reviews', () => {
    const id = Math.floor(Math.random() * 1000011);
    let getReviews = http.get(`http://127.0.0.1:3000/reviews/?product_id=${id}`);
    check(getReviews, {
      'status code check': (res) => res.status === 200,
    });
  });
  sleep(1);
}
