import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '15s', target: 20 },
    { duration: '30s', target: 10 },
    { duration: '15s', target: 0 },
  ]
};

export default function answers() {
  const min = 1;
  const max = 3518963;
  const questionId = Math.floor(Math.random() * (max - min + 1)) + min;
  let res = http.get(`http://localhost:8000/answers/${questionId}/answers`);
  check(res, { 'status was 200': r => r.status == 200});
  sleep(1);
}