
import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ErrorBoundary from './presentation/components/common/ErrorBoundary';
import Navbar from './presentation/components/layout/Navbar';
import Footer from './presentation/components/layout/Footer';
import HomePage from './presentation/pages/HomePage';
import SongsPage from './presentation/pages/SongsPage';
import OriginalsPage from './presentation/pages/OriginalsPage';
import FansDIYPage from './presentation/pages/FansDIYPage';
import AboutPage from './presentation/pages/AboutPage';
import GalleryPage from './presentation/pages/GalleryPage';
import LivestreamPage from './presentation/pages/LivestreamPage';
import DataAnalysisPage from './presentation/pages/DataAnalysisPage';

const App: React.FC = () => {
    return (
        <ReactRouterDOM.BrowserRouter>
            <Helmet>
                <meta name="keywords" content="咻咻满, XXM, 小满虫, 唱见, 音乐主播, 独立音乐人, B站up主 , 戏腔, 治愈系" />
            </Helmet>
            <ErrorBoundary>
                <div className="min-h-screen flex flex-col transition-all duration-500">
                    <Navbar />
                    <main className="flex-1">
                        <ReactRouterDOM.Routes>
                            <ReactRouterDOM.Route path="/" element={<HomePage />} />
                            <ReactRouterDOM.Route path="/songs" element={<SongsPage />} />
                            <ReactRouterDOM.Route path="/songs/hot" element={<SongsPage />} />
                            <ReactRouterDOM.Route path="/songs/originals" element={<SongsPage />} />
                            <ReactRouterDOM.Route path="/songs/submit" element={<SongsPage />} />
                            <ReactRouterDOM.Route path="/originals" element={<OriginalsPage />} />
                            <ReactRouterDOM.Route path="/gallery" element={<GalleryPage />} />
                            <ReactRouterDOM.Route path="/live" element={<LivestreamPage />} />
                            <ReactRouterDOM.Route path="/data" element={<DataAnalysisPage />} />
                            <ReactRouterDOM.Route path="/fansDIY" element={<FansDIYPage />} />
                            <ReactRouterDOM.Route path="/fansDIY/:collectionId" element={<FansDIYPage />} />
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
