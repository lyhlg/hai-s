import { useAuth } from '@/hooks/useAuth';
import OrderDashboard from '../OrderDashboard';

export function DashboardPage() {
  const { storeId } = useAuth();

  if (!storeId) {
    return <div>로그인이 필요합니다</div>;
  }

  return <OrderDashboard storeId={String(storeId)} />;
}
