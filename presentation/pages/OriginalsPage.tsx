import React from 'react';
import { Helmet } from 'react-helmet';
import OriginalsList from '../components/features/OriginalsList';

const OriginalsPage: React.FC = () => {
    return (
        <>
            <Helmet>
                <title>咻咻满原唱作品 - 个人原创单曲 | 小满虫之家</title>
                <meta name="description" content="浏览咻咻满的原创音乐作品，感受独特的音乐风格和创作理念。每首原创作品都记录着满老师的音乐心路历程。" />
            </Helmet>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <OriginalsList />
            </div>
        </>
    );
};

export default OriginalsPage;