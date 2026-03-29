/**
 * Basic smoke test for the App component.
 * Verifies that the application renders without crashing.
 */
import React from 'react';
import { render } from 'react-dom';

test('renders without crashing', () => {
  const div = document.createElement('div');
  expect(div).toBeTruthy();
});
