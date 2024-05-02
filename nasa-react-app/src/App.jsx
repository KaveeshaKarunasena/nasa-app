import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import SignIn from './components/SignIn';
import './App.css';
import SignUp from './components/SignUp';
import Header from './components/Header';
import { Home } from './components/Home';
import AstronomyPhotoFeed from './components/AstronomyPhotoFeed';
import { Route, Routes } from 'react-router-dom';
import { MarsRoverFeed } from './components/MarsRoverFeed';
import { PrivateGuard, GuestGuard } from './auth/AuthGuard';
import { ResetPassword } from './components/ResetPassowrd';


function UserRoute() {
  return (
    <PrivateGuard>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<AstronomyPhotoFeed />} />
        <Route path="/marsfeed" element={<MarsRoverFeed />} />
      </Routes>
    </PrivateGuard>
  );
}

function GuestRoute() {
  return (
    <GuestGuard>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/reset/password" element={<ResetPassword />} />
      </Routes>
    </GuestGuard>
  );
}

function App() {
  return (
    <div >
      <Routes>
        <Route path="user/*" element={<UserRoute />} />
        <Route path="*" element={<GuestRoute />} />
      </Routes>
    </div>
  );
}
export default App;
