import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">대시보드</h1>
      <Card>
        <CardHeader>
          <CardTitle>주문 모니터링</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Phase 2에서 구현 예정</p>
        </CardContent>
      </Card>
    </div>
  );
}
