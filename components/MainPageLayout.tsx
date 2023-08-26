import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';
import BackgroundImage from './BackgroundImage';
import BackgroundAnimation from './BackgroundAnimation';
import BlurEffect from './BlurEffect';
import { ThemeType, textColorMap, faviconMap, simpleTitleMap } from './themeMaps';

interface LayoutProps {
  theme: ThemeType;
  children: React.ReactNode;
  className?: string;
}

const MainPageLayout: React.FC<LayoutProps> = ({ theme, children, className }) => {
  
    const textColorClass = textColorMap[theme] || textColorMap["zimo"];
    const faviconSrc = faviconMap[theme] || faviconMap["zimo"];
    const simpleTitle = simpleTitleMap[theme] || simpleTitleMap["zimo"];

    return (
        <main>
            <Head>
                <link rel="icon" type="image/x-icon" href={faviconSrc} />
                <title>{simpleTitle}</title>
            </Head>
            <BackgroundImage theme={theme} />
            <BackgroundAnimation theme={theme} />
            <Navbar theme={theme} />
            <div className={`font-arial ${textColorClass} ${className}`}>
                {children}
            </div>
            <Footer theme={theme} />
        </main>
    );
};

export default MainPageLayout;
