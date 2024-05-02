import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import { AuthProvider,AuthContext } from '../src/auth/AuthProvide';
import { MemoryRouter } from 'react-router-dom';
import AstronomyPhotoFeed from '../src/components/AstronomyPhotoFeed';

jest.mock('axios');
jest.mock('../src/assets/cosmic.png', () => ({}));
jest.mock('@mui/x-date-pickers/internals/demo', () => ({
  DemoContainer: {},
}));

jest.mock('../src/auth/AuthProvide.mock.jsx');



describe('AstronomyPhotoFeed component tests', () => {
  const mockApiResponse = {
    date: '2024-04-29',
    explanation: 'A captivating image of a crescent Moon...',
    hdurl: 'https://apod.nasa.gov/apod/image/240429/crescentmoon_wu.jpg',
    title: 'Crescent Moon over the Pacific Ocean',
    url: 'https://apod.nasa.gov/apod/image/240429/crescentmoon_wu1024.jpg',
  };

  beforeEach(() => {
    axios.get.mockResolvedValueOnce({ data: mockApiResponse }); 
  });

  test('renders Astronomy Photo Feed with initial data', async () => {
    const navigateMock = jest.fn();

    render(
      <AuthContext.Provider value={{ user:jest.fn(), isLoading:jest.fn(), login:jest.fn(), logout:jest.fn() }}>
      <MemoryRouter>
        
          <AstronomyPhotoFeed/>
        
      </MemoryRouter>
      </AuthContext.Provider>
    );

    await new Promise(resolve => setTimeout(resolve, 1000));

    expect(screen.getByText(mockApiResponse.title)).toBeInTheDocument();
    expect(screen.getByText(mockApiResponse.date)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', mockApiResponse.hdurl);
    expect(screen.getByText(mockApiResponse.explanation)).not.toBeInTheDocument();
  });

//   test('expands content on click and displays explanation', async () => {
//     render(
//       <MemoryRouter>
//         <AuthProvider>
//           <AstronomyPhotoFeed />
//         </AuthProvider>
//       </MemoryRouter>
//     );

//     await new Promise(resolve => setTimeout(resolve, 1000));

//     const expandButton = screen.getByRole('button', { name: /show more/i });
//     fireEvent.click(expandButton);

//     expect(screen.getByText(mockApiResponse.explanation)).toBeInTheDocument();
//   });

//   test('calls download function on download icon click', async () => {
//     const mockDownloadFunction = jest.fn();
//     render(
//       <MemoryRouter>
//         <AuthProvider>
//           <AstronomyPhotoFeed handleDownload={mockDownloadFunction} />
//         </AuthProvider>
//       </MemoryRouter>
//     );

//     await new Promise(resolve => setTimeout(resolve, 1000));

//     const downloadButton = screen.getByRole('button', { name: /download/i });
//     fireEvent.click(downloadButton);

//     expect(mockDownloadFunction).toHaveBeenCalledWith(mockApiResponse.url);
//   });

//   test('renders date picker and allows date selection', async () => {
//     render(
//       <MemoryRouter>
//         <AuthProvider>
//           <AstronomyPhotoFeed />
//         </AuthProvider>
//       </MemoryRouter>
//     );

//     const datePickerInput = screen.getByLabelText('Select the date');
//     fireEvent.change(datePickerInput, { target: { value: '2023-12-25' } }); // Example date selection

//     // Wait for API request with new date to resolve
//     await new Promise(resolve => setTimeout(resolve, 1000));

//     expect(axios.get).toHaveBeenCalledWith('https://api.nasa.gov/planetary/apod?api_key=...'); // Check for new API call with selected date
//   });

  // Add more tests for error handling, loading states, etc. based on your implementation
});
