import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button, Separator, cn } from '@hai-s/dd';

const navItems = [
  { path: '/', label: '대시보드' },
  { path: '/tables', label: '테이블 관리' },
];

export function AppLayout() {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r bg-gray-50 p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">관리자</h2>
        <Separator className="mb-4" />
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={location.pathname === item.path ? 'secondary' : 'ghost'}
                className={cn('w-full justify-start')}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
        <Separator className="my-4" />
        <Button variant="outline" onClick={logout} className="w-full">
          로그아웃
        </Button>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
