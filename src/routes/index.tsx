import React from 'react';

import './index.scss';
import Navbar from '../components/navbar';
import FontAwesome from 'react-fontawesome';
import { useDispatch } from 'react-redux';
import { logout } from '../reducers/auth';

const Index = () => {
  const dispatch = useDispatch();
  return (
    <>
      <Navbar>
        <div className="logout" onClick={() => dispatch(logout())}>
          <FontAwesome name="sign-out-alt" /> Déconnexion
        </div>
      </Navbar>
      <div id="index"></div>
    </>
  );
};

export default Index;
