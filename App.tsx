import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LanguageProvider } from './context/LanguageContext';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAdmin(!!session);
      } catch (error) {
        console.error('Error checking session:', error);
        setIsAdmin(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAdminLogin = () => {
    // Auth state change listener will handle this automatically
    setIsAdmin(true);
  };

  const handleAdminLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAdmin(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <LanguageProvider>
      <HashRouter>
        <Routes>
          {/* Public Routes wrapped in Main Layout */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/collection" element={<Layout><Products /></Layout>} />
          <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              checkingAuth ? (
                <div className="min-h-screen bg-stone-900 flex items-center justify-center">
                  <div className="text-white text-lg">Loading...</div>
                </div>
              ) : isAdmin ? (
                <Layout><AdminDashboard /></Layout>
              ) : (
                <AdminLogin onLogin={handleAdminLogin} />
              )
            } 
          />
        </Routes>
      </HashRouter>
    </LanguageProvider>
  );
};

export default App;
