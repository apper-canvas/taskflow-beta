import { Outlet } from 'react-router-dom';
import Header from '@/components/organisms/Header';

const Layout = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      <Header />
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;