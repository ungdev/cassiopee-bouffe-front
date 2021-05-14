import { ThunkDispatch } from 'redux-thunk';

export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
}

export interface OrderItem {
  id: string;
  quantity: number;
  item: Item;
}

export interface Order {
  id: number;
  displayId: number;
  firstname: string;
  lastname: string;
  orderItems: OrderItem[];
  status: Status;
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  items: Item[];
}

export enum Status {
  Cancelled = 'cancelled',
  Pending = 'pending',
  Preparing = 'preparing',
  Ready = 'ready',
  Finished = 'finished',
}

// Redux
export interface State {
  auth: AuthState;
}

export interface Action {
  type: string;
  payload?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export type Dispatch = ThunkDispatch<State, void, Action>;
export type GetState = () => State;

export interface AuthState extends Vendor {
  token: string;
}
