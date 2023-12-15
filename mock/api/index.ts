import { MockMethod } from 'vite-plugin-mock';

export default [
  {
    url: '/prod-api/userInfo',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          name: "周子为",
          age: 25,
          sex: "男",
          phone: "13612345678"
        },
      };
    },
  },
] as MockMethod[];