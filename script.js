import http from 'k6/http';
import { sleep, check, group } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 1000 },
    { duration: '10s', target: 1000 },
    { duration: '20s', target: 0 },
  ],
};

export default function test() {
  group('GET reviews', () => {
    const id = Math.floor(Math.random() * 1000011);
    const getReviews = http.get(`http://127.0.0.1:3333/reviews/?product_id=${id}`);
    check(getReviews, {
      'status code check': (res) => res.status === 200,
      'duration < 250ms check': (response) => response.timings.duration < 250,
    });
    sleep(1);
  });

  group('GET meta', () => {
    const id = Math.floor(Math.random() * 1000011);
    const getMeta = http.get(`http://127.0.0.1:3333/reviews/meta/?product_id=${id}`);
    check(getMeta, {
      'status code check': (res) => res.status === 200,
      'duration < 250ms check': (response) => response.timings.duration < 250,
    });
    sleep(1);
  });
}
