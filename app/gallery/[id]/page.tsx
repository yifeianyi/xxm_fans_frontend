import { redirect } from 'next/navigation';

interface GalleryDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

/**
 * gallery/[id] 页面重定向到 albums/[id]
 * 
 * 避免与 Nginx /gallery/ 静态资源路径冲突
 */
export default async function GalleryDetailPage({ params }: GalleryDetailPageProps) {
    const { id } = await params;
    redirect(`/albums/${id}`);
}
