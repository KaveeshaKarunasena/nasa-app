import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../src/auth/AuthProvide';
import { Home } from '../src/components/Home';


jest.mock('../src/assets/cosmic.png', () => ({}));
jest.mock('../src/assets/apod.jpg', () => ({}));
jest.mock('../src/assets/NASA_Mars_Rover.jpg', () => ({}));
describe('Home Component', () => {
  test('renders component correctly', () => {

    const mockUserContextValue = {
      user: null, 
    };

    render(
      <AuthContext.Provider value={mockUserContextValue}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/explore the cosmos/i)).toBeInTheDocument();

    expect(screen.getByAltText(/astronomy picture of the day/i )).toBeInTheDocument();

    expect(screen.getByAltText(/mars rover photos/i)).toBeInTheDocument();
  });

  test('handles click events correctly when user is logged in', () => {
    const mockUserContextValue = {
      user: null,
    };

    const mockNavigate = jest.fn();

    jest.mock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockNavigate,
      }));

      const { getByAltText } =render(
      <AuthContext.Provider value={mockUserContextValue}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    fireEvent.click(screen.getByAltText(/astronomy picture of the day/i));
    fireEvent.click(getByAltText(/Mars Rover Photos/i));
  });

});
