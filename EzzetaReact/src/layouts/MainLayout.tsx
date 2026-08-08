import { Outlet } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import Chatbot from '../components/Chatbot/Chatbot';
import { ScrollToTopButton } from '../components/ScrollToTopButton';

export const MainLayout = () => {
  return (
    <div className="max-h-screen bg-white text-black">
      <Header />
      <main className="mx-auto min-h-[70vh] w-full max-w-7xl px-6 py-10 pt-24 lg:px-8">
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
      <ScrollToTopButton />
    </div>
  );
};
