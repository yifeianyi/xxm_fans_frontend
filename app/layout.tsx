import type { Metadata } from 'next';
import './globals.css';
import Navbar from './presentation/components/layout/Navbar';
import Footer from './presentation/components/layout/Footer';

export const metadata: Metadata = {
    title: '小满虫之家 - 咻咻满粉丝站',
    description: '咻咻满歌曲列表、二创作品、直播日历、图集展示',
    keywords: ['咻咻满', '小满虫之家', '歌曲', '翻唱', '直播'],
    openGraph: {
        title: '小满虫之家',
        description: '咻咻满粉丝站 - 收录所有音乐作品、演出记录和粉丝二创',
        images: ['/og-image.jpg'],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="zh-CN">
            <body className="antialiased min-h-screen flex flex-col bg-pastoral">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
