import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUp from '../src/components/SignUp';
import axios from 'axios';
import { Router } from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';


jest.mock('axios');
jest.mock('../src/assets/spaceImage5.jpg', () => '', { virtual: true });
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
 
describe('SignUp component tests', () => {
  test('Sign Up form validates and submits data', async () => {
    const navigate = jest.fn();
    const enqueueSnackbar = jest.fn();
    
    axios.post.mockResolvedValueOnce({ data: { email_token: 'valid_token' } });
    axios.post.mockResolvedValueOnce({ data: 'success' });

    render(<MemoryRouter><SignUp navigate={navigate} enqueueSnackbar={enqueueSnackbar} /></MemoryRouter>);

    
    const firstNameInput = screen.getByLabelText(/First Name/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    userEvent.type(firstNameInput, 'John');
    userEvent.type(lastNameInput, 'Doe');
    userEvent.type(emailInput, 'johndoe@sliit.lk');
    userEvent.type(passwordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
    userEvent.click(submitButton);

    expect(screen.queryByText(/All fields are required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Invalid email format/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Password must be at least 8 characters long/i)).not.toBeInTheDocument();

  });

  test('Sign Up form handles errors during data submission', async () => {
    const navigate = jest.fn();
    const enqueueSnackbar = jest.fn();

    axios.post.mockRejectedValueOnce({ response: { data: { err: 'Email already exists' } } });
    axios.post.mockRejectedValueOnce({ response: { data: { err: 'Invalid OTP' } } });

    render(<MemoryRouter><SignUp navigate={navigate} enqueueSnackbar={enqueueSnackbar} /></MemoryRouter>);

    const firstNameInput = screen.getByLabelText(/First Name/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    userEvent.type(firstNameInput, 'John');
    userEvent.type(lastNameInput, 'Doe');
    userEvent.type(emailInput, 'johndoe@sliit.lk');
    userEvent.type(passwordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
    userEvent.click(submitButton);
  })
})

