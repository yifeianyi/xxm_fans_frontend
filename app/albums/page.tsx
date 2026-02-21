import { redirect } from 'next/navigation';

/**
 * albums 页面重定向到 gallery
 * 
 * 为了兼容旧链接和用户的习惯，将 /albums 重定向到 /gallery
 */
export default function AlbumsPage() {
    redirect('/gallery');
}
