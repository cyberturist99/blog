import React from 'react';
import { useDispatch } from 'react-redux';

import { setNumber } from '../../store/slice';
import './App.module.scss';
import Header from '../Header/Header';
import Postlist from '../Postlist/Postlist';

function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setNumber(23));
  }, [dispatch]);

  return (
    <>
      <Header />
      <Postlist />
    </>
  );
}
export default App;
