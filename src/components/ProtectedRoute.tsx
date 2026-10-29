import React from 'react';
import { useFinancialStore } from '../context/FinancialContext';
import { UnauthorizedModal } from './UnauthorizedModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
  onNavigateLogin: () => void;
}

/**
 * Client-Side Supabase Route Guard & Access Controller
 *
 * Ensures that private financial modules (Profile, Time Machine, Household,
 * Impulse Guard, Macro, Expert Plan) are only accessible to authenticated users
 * or interactive sandbox demo sessions.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  onNavigateLogin,
}) => {
  const { isDemoMode, authUserEmail, isCloudSyncActive } = useFinancialStore();
  const [showModal, setShowModal] = React.useState(false);

  const isAuthenticated = Boolean(isDemoMode || (isCloudSyncActive && authUserEmail));

  React.useEffect(() => {
    if (!isAuthenticated) {
      setShowModal(true);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 font-black">
            🔒
          </div>
          <h2 className="text-xl font-black text-warm-900">Protected Fiduciary Area</h2>
          <p className="text-xs text-warm-600 max-w-sm">
            Please sign in or launch the interactive sandbox to view diagnostic calculations.
          </p>
          <button
            onClick={onNavigateLogin}
            className="clay-btn-primary px-4 py-2 text-xs font-bold"
          >
            Go to Sign In
          </button>
        </div>
        <UnauthorizedModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onNavigateLogin={onNavigateLogin}
        />
      </>
    );
  }

  return <>{children}</>;
};

