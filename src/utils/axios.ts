// eslint-disable-next-line
import axios, { AxiosError, ResponseType } from 'axios';
import { api } from 'src/boot/axios';
import { IResponseFetch, IResponseJsonMessage } from 'src/types';
import { MessageError } from './swal';

type method = 'DELETE' | 'POST' | 'PUT' | 'GET';

interface IRequest {
  method: method;
  body?: unknown;
  url: string;
  params?: { [key: string]: unknown };
  headers?: { [key: string]: string };
  responseType?: ResponseType;
}

interface IReadErrorFetch {
  responseFetch: IResponseFetch | boolean;
  message: string;
}

const configHeaders = {
  Accept: 'application/json, text/plain, */*',
  'Content-Type': 'application/json;charset=utf-8',
};

export async function fetchRequestAPI(configFetch: IRequest) {
  let resultFetch;
  configFetch.responseType = 'json';
  try {
    if (configFetch.method === 'GET') {
      resultFetch = await api.get(configFetch.url, {
        headers: { ...configHeaders, ...(configFetch.headers || {}) },
        params: configFetch.params,
      });
    } else if (configFetch.method === 'POST') {
      resultFetch = await api.post(configFetch.url, configFetch.body || {}, {
        params: configFetch.params || '',
        headers: { ...configHeaders, ...(configFetch.headers || {}) },
        responseType: configFetch.responseType,
      });
    } else if (configFetch.method === 'PUT') {
      resultFetch = await api.put(configFetch.url, configFetch.body || {}, {
        params: configFetch.params || '',
        headers: { ...configHeaders, ...(configFetch.headers || {}) },
      });
    } else if (configFetch.method === 'DELETE') {
      resultFetch = await api.delete(configFetch.url, {
        params: configFetch.params || '',
        headers: { ...configHeaders, ...(configFetch.headers || {}) },
      });
    } else {
      return false;
    }

    console.log(
      '🚀 ~ file: axios.ts ~ line 57 ~ fetchRequestAPI ~ resultFetch',
      resultFetch
    );

    if (resultFetch.status === 200 || resultFetch.status === 409) {
      console.log({
        data: resultFetch.data as unknown,
        status: resultFetch.status === 200 ? true : false,
      });
      return {
        data: resultFetch.data as unknown,
        status: resultFetch.status === 200 ? true : false,
      } as IResponseFetch;
    }

    return false;
  } catch (error: unknown | Error | AxiosError) {
    //console.log('🚑 ~ error', error);
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 409) {
        // aca esta el json el msg = {msg:"Mensaje"}
        /*console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);*/
        return {
          data: error.response.data as unknown,
          status: false,
        } as IResponseFetch;
      }
    }

    return false;
  }
}

export async function fetchRequestFileAPI(configFetch: IRequest) {
  let resultFetch;

  try {
    resultFetch = await api.post(configFetch.url, configFetch.body || {}, {
      params: configFetch.params || '',
      headers: { ...configHeaders, ...(configFetch.headers || {}) },
      responseType: 'blob',
    });

    if (resultFetch.status === 200) {
      return resultFetch.data as unknown;
    }

    return false;
  } catch (error) {
    return false;
    //throw new Error(String(error));
  }
}

export function readErrorFetch({ message, responseFetch }: IReadErrorFetch) {
  console.log(
    '🚀 ~ file: axios.ts ~ line 111 ~ readErrorFetch ~ responseFetch',
    responseFetch
  );
  if (!responseFetch) {
    MessageError({ title: message });
    return true;
  }

  const responseParse = responseFetch as IResponseFetch;
  //console.log('🚑 ~ responseParse', responseParse);

  if (!responseParse.status) {
    try {
      const messageParse = responseParse.data as IResponseJsonMessage;
      //console.log('🚑 ~ messageParse', messageParse);
      if (messageParse.hasOwnProperty('msg')) {
        MessageError({ title: messageParse.msg });
      } else {
        MessageError({ title: message });
      }

      return true;
    } catch (error) {
      MessageError({ title: message });
      return true;
    }
  }

  return false;
}
