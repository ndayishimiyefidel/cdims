import { type FC } from 'react';
import { RouterProvider } from 'react-router-dom';
import routes from './router';
import { ToastProvider } from './components/ui/Toast';

/**
 * Main App component
 * Sets up the application routing using RouterProvider
 */
const App: FC = () => {
  return (
    <ToastProvider>
      <RouterProvider router={routes} />
    </ToastProvider>
  );
};

export default App;