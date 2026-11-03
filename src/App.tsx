import React, { useState, useEffect } from 'react';
import { ToastContainer } from './components/ToastContainer';
import { AdvisorDashboardModal } from './components/AdvisorDashboardModal';
import { UnauthorizedModal } from './components/UnauthorizedModal';
import { MobilePrototype } from './components/MobilePrototype';
import { AuthPages } from './pages/AuthPages';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsAndConditionsPage } from './pages/TermsAndConditionsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  // Current top-level route: 'app' | 'login' | 'signup' | 'privacy-policy' | 'terms-and-conditions' | '404'
  const [currentRoute, setCurrentRoute] = useState<string>('app');
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);
  const [isUnauthorizedModalOpen, setIsUnauthorizedModalOpen] = useState(false);

  // Sync hash/path if present so GitHub Pages never 404s
  useEffect(() => {
    const handleLocation = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      const path = window.location.pathname.replace(/^\//, '');
      const target = hash || path;

      if (target === 'login') setCurrentRoute('login');
      else if (target === 'signup') setCurrentRoute('signup');
      else if (target === 'privacy-policy') setCurrentRoute('privacy-policy');
      else if (target === 'terms-and-conditions') setCurrentRoute('terms-and-conditions');
      else if (target === '404') setCurrentRoute('404');
      else if (target === 'demo') {
        setCurrentRoute('app');
      }
    };
    handleLocation();
    window.addEventListener('popstate', handleLocation);
    window.addEventListener('hashchange', handleLocation);
    return () => {
      window.removeEventListener('popstate', handleLocation);
      window.removeEventListener('hashchange', handleLocation);
    };
  }, []);

  const navigateTo = (route: string) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (route === 'app') {
      window.history.pushState(null, '', '#/');
    } else {
      window.history.pushState(null, '', `#/${route}`);
    }
  };

  // Render sub-page depending on route
  const renderContent = () => {
    if (currentRoute === 'login') {
      return (
        <AuthPages
          initialView="login"
          onNavigateRoute={(route) => navigateTo(route)}
        />
      );
    }

    if (currentRoute === 'signup') {
      return (
        <AuthPages
          initialView="signup"
          onNavigateRoute={(route) => navigateTo(route)}
        />
      );
    }

    if (currentRoute === 'privacy-policy') {
      return <PrivacyPolicyPage onBack={() => navigateTo('app')} />;
    }

    if (currentRoute === 'terms-and-conditions') {
      return <TermsAndConditionsPage onBack={() => navigateTo('app')} />;
    }

    if (currentRoute === '404') {
      return <NotFoundPage onNavigateRoute={(route) => navigateTo(route)} />;
    }

    // Default Main App: Exact Pure Mobile-First Prototype
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center sm:py-6">
        <MobilePrototype onOpenAdvisorModal={() => setIsAdvisorModalOpen(true)} />
      </div>
    );
  };

  return (
    <>
      {renderContent()}
      <AdvisorDashboardModal
        isOpen={isAdvisorModalOpen}
        onClose={() => setIsAdvisorModalOpen(false)}
      />
      <UnauthorizedModal
        isOpen={isUnauthorizedModalOpen}
        onClose={() => setIsUnauthorizedModalOpen(false)}
        onNavigateLogin={() => navigateTo('login')}
      />
      <ToastContainer />
    </>
  );
};

export default App;
