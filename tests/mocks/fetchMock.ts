import nodeFetch from 'node-fetch';
import mockData from '../mocks/figmaTree.json';

export const fetchMock = jest.fn();

const mockResponse = () => {
  return {
    status: 200,
    json: () => mockData
  };
};

jest.mock('node-fetch', () => {
  return async (url: string, options: any) => {
    const response = await fetchMock(url, options);
    return mockResponse();
  };
});

export default nodeFetch;
