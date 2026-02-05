
import React, { Suspense, lazy } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ErrorBoundary from './presentation/components/common/ErrorBoundary';
import Navbar from './presentation/components/layout/Navbar';
import Footer from './presentation/components/layout/Footer';
import { Loading } from './presentation/components/common/Loading';

// 使用 React.lazy 实现路由级代码分割
// 将页面组件拆分为独立的 chunk，按需加载
const HomePage = lazy(() => import('./presentation/pages/HomePage'));
const SongsPage = lazy(() => import('./presentation/pages/SongsPage'));
const OriginalsPage = lazy(() => import('./presentation/pages/OriginalsPage'));
const FansDIYPage = lazy(() => import('./presentation/pages/FansDIYPage'));
const AboutPage = lazy(() => import('./presentation/pages/AboutPage'));
const GalleryPage = lazy(() => import('./presentation/pages/GalleryPage'));
const LivestreamPage = lazy(() => import('./presentation/pages/LivestreamPage'));
const DataAnalysisPage = lazy(() => import('./presentation/pages/DataAnalysisPage'));
const ContactPage = lazy(() => import('./presentation/pages/ContactPage'));

// 路由配置
const routes = [
    { path: '/', element: <HomePage /> },
    { path: '/songs', element: <SongsPage /> },
    { path: '/songs/hot', element: <SongsPage /> },
    { path: '/songs/originals', element: <SongsPage /> },
    { path: '/songs/submit', element: <SongsPage /> },
    { path: '/originals', element: <OriginalsPage /> },
    { path: '/gallery', element: <GalleryPage /> },
    { path: '/live', element: <LivestreamPage /> },
    { path: '/data', element: <DataAnalysisPage /> },
    { path: '/fansDIY', element: <FansDIYPage /> },
    { path: '/fansDIY/:collectionId', element: <FansDIYPage /> },
    { path: '/about', element: <AboutPage /> },
    { path: '/contact', element: <ContactPage /> },
];

// 页面加载 fallback 组件
const PageLoading: React.FC = () => (
    <div className="min-h-[50vh] flex items-center justify-center">
        <Loading size="lg" />
    </div>
);

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
                        <Suspense fallback={<PageLoading />}>
                            <ReactRouterDOM.Routes>
                                {routes.map((route) => (
                                    <ReactRouterDOM.Route
                                        key={route.path}
                                        path={route.path}
                                        element={route.element}
                                    />
                                ))}
                            </ReactRouterDOM.Routes>
                        </Suspense>
                    </main>
                    <Footer />
                </div>
            </ErrorBoundary>
        </ReactRouterDOM.BrowserRouter>
    );
};

export default App;
