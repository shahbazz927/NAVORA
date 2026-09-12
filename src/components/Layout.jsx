import Header from './Header';
import Footer from './Footer';
import AnimatedPage from './AnimatedPage';
import OfflineBanner from './states/OfflineBanner';

export default function Layout({ children, showHeader = true, showFooter = true }) {
  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <Header />}
      {showHeader && <OfflineBanner />}
      <main className={`flex-1 ${showHeader ? 'pt-[4.25rem]' : ''}`}>
        <AnimatedPage>{children}</AnimatedPage>
      </main>
      {showFooter && <Footer />}
    </div>
  );
}