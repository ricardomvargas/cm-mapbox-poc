import React /*, { useState }*/ from 'react';

import { useMap } from '../../context/mapContext/MapContext';

import './Sidebar.css';

const Sidebar = () => {
  // const [enableDrawing, setEnableDrawing] = useState('Enable');
  const { state, dispatch } = useMap();

  const changeProjection = (e: any) =>
    dispatch({ type: 'change-projection', payload: { projection: e.target.value } });

  /* The disable drawing option is not working, so the button was temporary disabled
  const handleActiveDrawing = () => {
    const newEnableDrawing = enableDrawing === 'on' ? 'off' : 'on';
    dispatch({ type: 'draw-mode', payload: { drawMode: newEnableDrawing }});
    setEnableDrawing(newEnableDrawing);
  };*/

  return (
    <section className='sidebar'>
      <div>
        <label>Projetion:</label>
        <select onChange={(e) => changeProjection(e)}>
          <option value='mercator'>Mercator</option>
          <option value='globe'>Globe</option>
        </select>
      </div>
      {/* <div>
        <label>Drawing:</label>
        <button onClick={handleActiveDrawing}>{enableDrawing}</button>
      </div> */}
      <div>
        <label>Another item:</label>
        <input type='text' value='another input...' />
      </div>
    </section>
  );
};

export default Sidebar;
