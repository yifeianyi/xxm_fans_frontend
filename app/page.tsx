import { Metadata } from 'next';
import HomePageClient from './components/features/HomePageClient';

export const metadata: Metadata = {
    title: '咻咻满粉丝网站 - 小满虫之家 | 独立音乐人、音乐主播',
    description: '欢迎来到咻咻满粉丝站！这里汇集了咻咻满的所有歌曲作品、演出记录、粉丝二创和精彩图集。关注咻咻满，感受治愈系的歌声和戏韵魅力。',
};

export const revalidate = 3600; // ISR: 1 小时

export default function HomePage() {
    return <HomePageClient />;
}
