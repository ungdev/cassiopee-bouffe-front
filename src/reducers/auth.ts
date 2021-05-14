import { API, setAPIToken } from '../utils/api';
import { toast } from 'react-toastify';
import { AuthState, Action, Dispatch, Vendor } from '../types';

const initialState: AuthState = {
  id: null,
  name: null,
  items: [],
  token: null,
};

const BOUFFE_TOKEN = 'bouffe-token';

const SET_VENDOR = 'SET_VENDOR';
const CLEAR_VENDOR = 'CLEAR_VENDOR';

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case SET_VENDOR:
      return {
        ...state,
        ...action.payload,
      };

    case CLEAR_VENDOR:
      return initialState;
  }

  return state;
};

export const setVendor = (vendor: AuthState) => {
  setAPIToken(vendor.token);

  localStorage.setItem(BOUFFE_TOKEN, vendor.token);

  return {
    type: SET_VENDOR,
    payload: vendor,
  };
};

export const logout = () => (dispatch: Dispatch) => {
  localStorage.removeItem(BOUFFE_TOKEN);

  setAPIToken(null);

  dispatch({ type: CLEAR_VENDOR });
  toast('Vous avez été déconnecté');
};

export const tryLogin = (pin: string) => async (dispatch: Dispatch) => {
  const res = await API.post<AuthState>(`/vendors/login`, { pin });
  const vendor = res.data;
  localStorage.setItem(BOUFFE_TOKEN, vendor.token);
  dispatch(setVendor(vendor));
  toast.success('Connexion validée');
};

export const autoLogin = () => async (dispatch: Dispatch) => {
  if (localStorage.hasOwnProperty(BOUFFE_TOKEN)) {
    const token = localStorage.getItem(BOUFFE_TOKEN) as string;

    try {
      const response = await API.post<Vendor>('/vendors/me', { token });
      const vendor = response.data;

      dispatch(setVendor({ token, ...vendor }));
    } catch (err) {
      dispatch(logout());
    }
  }
};
