import axios, { Method, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

let token: string | null = null;

const requestAPI = <T>(method: Method, route: string, body?: object) => {
  return new Promise<AxiosResponse<T>>((resolve, reject) => {
    axios
      .request<T>({
        baseURL: import.meta.env.VITE_API_URL,
        method,
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        url: route,
        data: body,
        timeout: 5000,
      })
      .then((res) => resolve(res))
      .catch((err) => {
        if (err.message === 'Network Error' || err.code === 'ECONNABORTED') {
          toast.error('Connexion au serveur perdue');
        } else {
          toast.error(
            err.response && err.response.data && err.response.data.error
              ? err.response.data.error
              : 'Une erreur est survenue',
          );
        }
        reject();
      });
  });
};

export const setAPIToken = (_token: string | null) => {
  token = _token;
};

export const API = {
  get: <T>(route: string) => requestAPI<T>('GET', route),
  post: <T>(route: string, body: object) => requestAPI<T>('POST', route, body),
  put: <T>(route: string, body: object) => requestAPI<T>('PUT', route, body),
  patch: <T>(route: string, body: object) => requestAPI<T>('PATCH', route, body),
  delete: <T>(route: string) => requestAPI<T>('DELETE', route),
};
