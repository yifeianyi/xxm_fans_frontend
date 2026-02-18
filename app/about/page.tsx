import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '关于满满 | 小满虫之家',
    description: '了解咻咻满的故事，她的声线特色，以及成长历程。',
};

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-black text-[#5d4037] mb-8 text-center">
                关于满满
            </h1>
            
            <div className="glass-card rounded-[2rem] p-8 md:p-12 space-y-8">
                <section className="space-y-4">
                    <h2 className="text-2xl font-black text-[#8eb69b]">咻咻满是谁？</h2>
                    <p className="text-[#6b9b7a] leading-relaxed">
                        咻咻满（Xiuxiuman）是B站知名唱见、独立音乐人。以其独特的声线和出色的唱功，
                        在B站积累了大量粉丝。她的演唱风格多样，擅长古风、流行、戏腔等多种曲风，
                        被誉为"宝藏歌手"。
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black text-[#8eb69b]">声线特色</h2>
                    <p className="text-[#6b9b7a] leading-relaxed">
                        满满的嗓音温暖治愈，高音清亮通透，低音醇厚动人。
                        她特别擅长戏腔演唱，将传统戏曲元素与现代流行音乐完美融合，
                        创造出独具一格的音乐风格。
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black text-[#8eb69b]">关于本站</h2>
                    <p className="text-[#6b9b7a] leading-relaxed">
                        小满虫之家是咻咻满的粉丝自建网站，致力于收录和整理满满的所有音乐作品、
                        直播记录和相关信息。本站非官方性质，所有资源版权归原著作权人所有。
                    </p>
                </section>
            </div>
        </div>
    );
}
