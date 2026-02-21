import { redirect } from 'next/navigation';

/**
 * gallery 页面重定向到 albums
 * 
 * 避免与 Nginx /gallery/ 静态资源路径冲突
 */
export default function GalleryPage() {
    redirect('/albums');
}
