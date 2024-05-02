import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignIn from '../src/components/SignIn';
import axios from 'axios';
import { AuthProvider } from '../src/auth/AuthProvide';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios');
jest.mock('../src/assets/spaceImage4.jpg', () => '', { virtual: true });
jest.mock('../src/auth/AuthProvide.mock.jsx');

describe('SignIn component tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
      });
  test('Sign In form validates and submits data with successful login', async () => {
    const loginMock = jest.fn();
    const navigateMock = jest.fn();

    render(
      <MemoryRouter>
        <AuthProvider>
          <SignIn navigate={navigateMock} />
        </AuthProvider>
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    userEvent.type(emailInput, 'johndoe@sliit.lk');
    userEvent.type(passwordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: /Sign In/i });
    userEvent.click(submitButton);

    expect(screen.queryByText(/All fields are required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Invalid email format/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Password must be at least 8 characters long/i)).not.toBeInTheDocument();

    await axios.post.mockResolvedValueOnce({ data: 'success' });

    expect(window.location.pathname).toBe('/');
  });

});
