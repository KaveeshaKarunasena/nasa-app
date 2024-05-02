import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MarsRoverFeed } from '../src/components/MarsRoverFeed';
import { AuthContext } from '../src/auth/AuthProvide';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios');
jest.mock('../src/assets/cosmic.png', () => ({}));
jest.mock('@mui/x-date-pickers/internals/demo', () => ({
    DemoContainer: {},
  }));
describe('MarsRoverFeed Component', () => {
  test('renders component correctly', () => {
    const authValue = { 
        user: jest.fn(), 
        isLoading: jest.fn(), 
        login: jest.fn(), 
        logout: jest.fn() 
      };
    render(<AuthContext.Provider value={authValue}>
    <MemoryRouter><MarsRoverFeed /></MemoryRouter></AuthContext.Provider>);
    
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByLabelText('Select the date')).toBeInTheDocument();

    expect(screen.getByLabelText('Select a rover')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Filter' })).toBeInTheDocument();

    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

//   test('fetches data when filter button is clicked', async () => {
//     render(<MarsRoverFeed />);

//     // Mock API response
//     global.fetch = jest.fn(() =>
//       Promise.resolve({
//         json: () => Promise.resolve({ photos: [{ img_src: 'test_image.jpg', camera: { full_name: 'Test Camera' }, earth_date: '2024-04-29', sol: 100 }] }),
//       })
//     );

//     // Select a date
//     fireEvent.change(screen.getByLabelText('Select the date'), { target: { value: '2024-04-29' } });

//     // Select a rover
//     fireEvent.change(screen.getByLabelText('Select a rover'), { target: { value: 'Curiosity' } });

//     // Click the filter button
//     fireEvent.click(screen.getByRole('button', { name: 'Filter' }));

//     // Wait for the API call to complete
//     await waitFor(() => {
//       expect(global.fetch).toHaveBeenCalledTimes(1);
//     });

//     // Ensure that the image card is rendered
//     expect(screen.getByAltText('Image 0')).toBeInTheDocument();

//     // Ensure that the download button is rendered
//     expect(screen.getByText('Download')).toBeInTheDocument();
//   });

//   test('displays error message for invalid selection', async () => {
//     render(<MarsRoverFeed />);

//     // Click the filter button without selecting a rover or date
//     fireEvent.click(screen.getByRole('button', { name: 'Filter' }));

//     // Ensure that the error message is displayed
//     await waitFor(() => {
//       expect(screen.getByText('Select a valid rover type')).toBeInTheDocument();
//       expect(screen.getByText('Select a valid date')).toBeInTheDocument();
//     });
//   });
});
