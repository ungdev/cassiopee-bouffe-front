import React from 'react';

import './index.scss';
import Navbar from '../components/navbar';
import FontAwesome from 'react-fontawesome';
import { useDispatch } from 'react-redux';
import { logout } from '../reducers/auth';
import { useHistory } from 'react-router';

const Index = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  return (
    <>
      <Navbar>
        <div className="logout" onClick={() => dispatch(logout())}>
          <FontAwesome name="sign-out-alt" /> Déconnexion
        </div>
      </Navbar>
      <div id="index">
        <div onClick={() => history.push('/preparation')}>
          <FontAwesome name="check" /> Préparation générale
        </div>
        <div onClick={() => history.push('/items')}>
          <FontAwesome name="receipt" /> Gestion des items
        </div>
      </div>
    </>
  );
};

export default Index;
