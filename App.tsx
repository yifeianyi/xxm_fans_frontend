
import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { ErrorBoundary } from './presentation/components/common/ErrorBoundary';
import Navbar from './presentation/components/layout/Navbar';
import Footer from './presentation/components/layout/Footer';
import SongsPage from './presentation/pages/SongsPage';
import FansDIYPage from './presentation/pages/FansDIYPage';
import AboutPage from './presentation/pages/AboutPage';
import GalleryPage from './presentation/pages/GalleryPage';
import LivestreamPage from './presentation/pages/LivestreamPage';
import DataAnalysisPage from './presentation/pages/DataAnalysisPage';

const App: React.FC = () => {
  return (
    <ReactRouterDOM.BrowserRouter>
      <ErrorBoundary>
        <div className="min-h-screen flex flex-col transition-all duration-500">
          <Navbar />
          <main className="flex-1">
            <ReactRouterDOM.Routes>
              <ReactRouterDOM.Route path="/" element={<ReactRouterDOM.Navigate to="/songs" replace />} />
              <ReactRouterDOM.Route path="/songs" element={<SongsPage />} />
              <ReactRouterDOM.Route path="/gallery" element={<GalleryPage />} />
              <ReactRouterDOM.Route path="/live" element={<LivestreamPage />} />
              <ReactRouterDOM.Route path="/data" element={<DataAnalysisPage />} />
              <ReactRouterDOM.Route path="/fansDIY" element={<FansDIYPage />} />
              <ReactRouterDOM.Route path="/about" element={<AboutPage />} />
            </ReactRouterDOM.Routes>
          </main>
          <Footer />
        </div>
      </ErrorBoundary>
    </ReactRouterDOM.BrowserRouter>
  );
};

export default App;
