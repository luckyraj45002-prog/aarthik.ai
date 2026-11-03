import React, { useState, useEffect } from 'react';
import { useFinancialStore } from './context/FinancialContext';
import { Header } from './components/Header';
import { TabBar } from './components/TabBar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { AdvisorDashboardModal } from './components/AdvisorDashboardModal';
import { UnauthorizedModal } from './components/UnauthorizedModal';

import { ProfileModule } from './pages/ProfileModule';
import { TimeMachineModule } from './pages/TimeMachineModule';
import { HouseholdModule } from './pages/HouseholdModule';
import { GatewayModule } from './pages/GatewayModule';
import { ImpulseGuardModule } from './pages/ImpulseGuardModule';
import { MacroModule } from './pages/MacroModule';
import { PersonalizedPlanModule } from './pages/PersonalizedPlanModule';
import { MobilePrototype } from './components/MobilePrototype';
import { Smartphone, Monitor } from 'lucide-react';

import { AuthPages } from './pages/AuthPages';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsAndConditionsPage } from './pages/TermsAndConditionsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  const { activeTab } = useFinancialStore();

  // Mode: 'mobile' (exact mobile-first prototype) | 'desktop' (extended studio dashboard)
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');

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

    // Exact Mobile-First Prototype View (Default)
    if (viewMode === 'mobile') {
      return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center sm:py-6">
          {/* Desktop Preview Bar */}
          <div className="w-full max-w-md px-4 pb-2.5 hidden sm:flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-[#6C5CE7]" />
              Mobile-First Prototype
            </span>
            <button
              onClick={() => setViewMode('desktop')}
              className="flex items-center gap-1 text-[#6C5CE7] hover:underline font-medium bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-xs transition-all hover:bg-slate-50"
            >
              <Monitor className="w-3 h-3" />
              <span>Switch to Studio Mode</span>
            </button>
          </div>

          <MobilePrototype onOpenAdvisorModal={() => setIsAdvisorModalOpen(true)} />
        </div>
      );
    }

    // Extended Studio Dashboard (Desktop Route)
    return (
      <ProtectedRoute onNavigateLogin={() => navigateTo('login')}>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'profile' && <ProfileModule />}
          {activeTab === 'time-machine' && <TimeMachineModule />}
          {activeTab === 'household' && <HouseholdModule />}
          {activeTab === 'gateway' && <GatewayModule />}
          {activeTab === 'impulse-guard' && <ImpulseGuardModule />}
          {activeTab === 'macro' && <MacroModule />}
          {(activeTab === 'personalized-plan' || activeTab === 'expert-plan') && (
            <PersonalizedPlanModule onOpenAdvisorModal={() => setIsAdvisorModalOpen(true)} />
          )}
        </main>
      </ProtectedRoute>
    );
  };

  // If in mobile mode on the main app route, render the mobile frame directly
  if (currentRoute === 'app' && viewMode === 'mobile') {
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
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F4EC] text-[#2D2118]">
      {/* Header */}
      <Header
        onOpenAdvisorModal={() => setIsAdvisorModalOpen(true)}
        onNavigateRoute={navigateTo}
      />

      {/* Floating Pill to switch to Mobile View on Desktop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 flex justify-end">
        <button
          onClick={() => setViewMode('mobile')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#6C5CE7] hover:bg-[#5b4cdb] text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Switch to Mobile Prototype</span>
        </button>
      </div>

      {/* 7 Tab Navigation Pills (only visible in main app mode) */}
      {currentRoute === 'app' && <TabBar />}

      {/* Main Content Area */}
      <div className="flex-1">{renderContent()}</div>

      {/* Global Persistent Footer */}
      <Footer onNavigateRoute={navigateTo} />

      {/* Modals & Overlays */}
      <AdvisorDashboardModal
        isOpen={isAdvisorModalOpen}
        onClose={() => setIsAdvisorModalOpen(false)}
      />

      <UnauthorizedModal
        isOpen={isUnauthorizedModalOpen}
        onClose={() => setIsUnauthorizedModalOpen(false)}
        onNavigateLogin={() => navigateTo('login')}
      />

      {/* Interactive Polish: Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default App;
