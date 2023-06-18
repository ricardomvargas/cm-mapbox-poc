import React, { useState } from 'react';

import { useMap } from '../../context/mapContext/MapContext';

import './Sidebar.css';

const Sidebar = () => {
  const [currentProjection, setCurrentProjection] = useState('mercator');
  const { state, dispatch } = useMap();

  const changeProjection = (e: any) =>
    dispatch({ type: 'change-projection', payload: { projection: e.target.value } });

  return (
    <section className='sidebar'>
      <div>
        <label>Projetion:</label>
        <select onChange={(e) => changeProjection(e)}>
          <option value='mercator'>Mercator</option>
          <option value='globe'>Globe</option>
        </select>
      </div>
      <div>
        <label>Another item:</label>
        <input type='text' value='another input...' />
      </div>
      <div>
        <label>Another item:</label>
        <input type='text' value='another input...' />
      </div>
    </section>
  );
};

export default Sidebar;
