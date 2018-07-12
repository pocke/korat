import 'whatwg-fetch';
import Takoneko from './index';
delete console.log;

test('test', () => {
  expect(1).toEqual(1);
});

const accessToken = process.env.GITHUB_ACCESS_TOKEN;
if (accessToken) {
  test('test with real access', async () => {
    const client = new Takoneko(accessToken);
    const result = await client.requset('GET', '/user');
    expect(result.status).toEqual(200);
    const json = await result.json();
    expect(json.login).toEqual('pocke');
  });
}
