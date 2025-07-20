import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import CampaignList from './CampaignList';
import CampaignDetail from './CampaignDetail';
import DonationForm from './DonationForm';
import Login from './Login';
import Register from './Register';
import DonorDashboard from './DonorDashboard';
import ManagerDashboard from './ManagerDashboard';
import PaymentFinish from './paymentFinish';
import { AuthProvider } from './AuthContext';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/campaigns" element={<CampaignList />} />
          <Route path="/campaigns/:id" element={<CampaignDetail />} />
          <Route path="/campaigns/:id/donate" element={<DonationForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/donor" element={<DonorDashboard />} />
          <Route path="/dashboard/manager" element={<ManagerDashboard />} />
          <Route path="/payment/finish" element={<PaymentFinish />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);