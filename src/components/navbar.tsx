import React, { useEffect, useState } from 'react';
import FontAwesome from 'react-fontawesome';
import moment from 'moment';

import './navbar.scss';
import { State } from '../types';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

interface PropTypes {
  back?: string;
  onBack?: () => void;
  children?: React.ReactNode;
}

const Navbar = ({ back, onBack, children }: PropTypes) => {
  const history = useHistory();
  const [time, setTime] = useState(moment().format('H[h]mm'));
  const name = useSelector((state: State) => state.auth.name);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment().format('H[h]mm'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const onBackClick = () => {
    if (onBack) {
      onBack();
    }

    if (back) {
      history.push(back);
    }
  };

  return (
    <nav className="navbar">
      {back ? (
        <div className="back absolute-left" onClick={() => onBackClick()}>
          <FontAwesome name="chevron-left" />
        </div>
      ) : (
        ''
      )}
      <span className="title" onClick={() => window.location.reload()}>
        <FontAwesome name="sync-alt" className="reload-icon" /> {time} - {name}
      </span>

      <div className="absolute-right">{children ? children : ''}</div>
    </nav>
  );
};

export default Navbar;
