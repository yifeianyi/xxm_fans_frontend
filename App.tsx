
import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ErrorBoundary } from './presentation/components/common/ErrorBoundary';
import Navbar from './presentation/components/layout/Navbar';
import Footer from './presentation/components/layout/Footer';
import HomePage from './presentation/pages/HomePage';
import SongsPage from './presentation/pages/SongsPage';
import FansDIYPage from './presentation/pages/FansDIYPage';
import AboutPage from './presentation/pages/AboutPage';
import GalleryPage from './presentation/pages/GalleryPage';
import ComingSoonPage from './presentation/pages/ComingSoonPage';

const App: React.FC = () => {
    return (
        <ReactRouterDOM.BrowserRouter>
            <Helmet>
                <meta name="keywords" content="咻咻满, XXM, 小满虫, 唱见, 音乐主播, 独立音乐人, 戏腔, 治愈系" />
            </Helmet>
            <ErrorBoundary>
                <div className="min-h-screen flex flex-col transition-all duration-500">
                    <Navbar />
                    <main className="flex-1">
                        <ReactRouterDOM.Routes>
                            <ReactRouterDOM.Route path="/" element={<HomePage />} />
                            <ReactRouterDOM.Route path="/songs" element={<SongsPage />} />
                            <ReactRouterDOM.Route path="/gallery" element={<GalleryPage />} />
                            <ReactRouterDOM.Route path="/live" element={<ComingSoonPage title="直播日历" description="直播记录与日程管理功能正在筹备中..." />} />
                            <ReactRouterDOM.Route path="/data" element={<ComingSoonPage title="满の数据" description="数据分析功能正在筹备中..." />} />
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
