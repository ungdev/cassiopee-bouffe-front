import React, { useEffect } from 'react';
import moment from 'moment';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.scss';

import Index from './routes';

import store from './reducers';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import { State } from './types';
import { autoLogin } from './reducers/auth';
import Login from './routes/login';
import Preparation from './routes/preparation';
import Items from './routes/items';

toast.configure({
  autoClose: 3000,
  pauseOnHover: true,
  transition: Flip,
  hideProgressBar: true,
});

// TODO: corriger la locale
moment.locale('fr');

const MainRouter = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: State) => state);

  useEffect(() => {
    dispatch(autoLogin());
  }, []); // eslint-disable-line

  if (!state.auth.token) return <Login />;

  const basename = import.meta.env.VITE_PREFIX ?? '/';

  return (
    <Router basename={basename}>
      <Switch>
        <Route exact path="/" component={Index} />
        <Route path="/preparation" component={Preparation} />
        <Route path="/items" component={Items} />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

const App = () => (
  <Provider store={store}>
    <MainRouter />
  </Provider>
);

export default App;
