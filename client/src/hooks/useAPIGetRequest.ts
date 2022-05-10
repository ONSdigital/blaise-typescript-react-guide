import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import APIContext from '../components/APIContext';

// eslint-disable-next-line no-shadow
export enum ResponseState {
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error,'
}

interface LoadingResponse {
  state: ResponseState.LOADING
}

interface LoadedResponse<DataType> {
  state: ResponseState.LOADED
  data: DataType
}

interface ErrorResponse {
  state: ResponseState.ERROR
  error: string
}

type Response<DataType> = LoadingResponse | LoadedResponse<DataType> | ErrorResponse

export default function useAPIGetRequest<DataType>(path: string): Response<DataType> {
  const { endpoint } = useContext(APIContext);

  const [response, setResponse] = useState<Response<DataType>>({ state: ResponseState.LOADING });

  useEffect(() => {
    function setLoaded(data: DataType) {
      setResponse({ state: ResponseState.LOADED, data });
    }

    function setErrored(err: Error) {
      setResponse({ state: ResponseState.ERROR, error: err.toString() });
    }

    // todo: reloading?
    async function fetchData(): Promise<DataType> {
      return (await axios.get<DataType>(`${endpoint}${path}`)).data;
    }

    fetchData()
      .then(setLoaded)
      .catch(setErrored);
  }, [endpoint, path]);

  return response;
}
