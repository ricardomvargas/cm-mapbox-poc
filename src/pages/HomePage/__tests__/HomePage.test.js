import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import HomePage from '../HomePage';

const Wraper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

test('Check if match with snapshot', () => {
    const simpleComponent = render(
        <Wraper children={<HomePage pageTitle='Test Home Page' />} />
    );
    expect(simpleComponent).toMatchSnapshot();
});
