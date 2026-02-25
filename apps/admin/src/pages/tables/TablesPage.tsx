import { useState, type FormEvent } from 'react';
import { useTables } from '@/hooks/useTables';
import { AxiosError } from 'axios';
import { toast } from '@hai-s/dd';
import {
  Button, Input, Label, Card, CardContent, CardHeader, CardTitle,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
  Badge, Alert, AlertDescription, Spinner,
} from '@hai-s/dd';

export function TablesPage() {
  const { tables, loading, error: fetchError, create } = useTables();
  const [tableNumber, setTableNumber] = useState('');
  const [password, setPassword] = useState('');
  const [createError, setCreateError] = useState('');
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    const num = Number(tableNumber);
    if (!num || num <= 0 || !password) {
      setCreateError('테이블 번호(양수)와 비밀번호를 입력해주세요');
      return;
    }
    setCreating(true);
    setCreateError('');
    try {
      await create({ tableNumber: String(num), password });
      setTableNumber('');
      setPassword('');
      setOpen(false);
      toast({ title: '테이블이 생성되었습니다', variant: 'success' });
    } catch (err) {
      if (err instanceof AxiosError) {
        setCreateError(err.response?.data?.message ?? '테이블 생성 실패');
      } else {
        setCreateError('테이블 생성 실패');
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">테이블 관리</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>테이블 추가</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 테이블 생성</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="tableNumber">테이블 번호</Label>
                <Input id="tableNumber" type="number" min="1" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} placeholder="예: 1" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="tablePassword">비밀번호</Label>
                <Input id="tablePassword" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="태블릿 로그인용 비밀번호" />
              </div>
              {createError && (
                <Alert variant="destructive">
                  <AlertDescription>{createError}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" disabled={creating}>
                {creating ? '생성 중...' : '생성'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>테이블 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex justify-center py-8">
              <Spinner className="size-6" />
            </div>
          )}
          {fetchError && (
            <Alert variant="destructive">
              <AlertDescription>{fetchError}</AlertDescription>
            </Alert>
          )}
          {!loading && tables.length === 0 && (
            <p className="text-center text-gray-500 py-8">등록된 테이블이 없습니다</p>
          )}
          {tables.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>테이블 번호</TableHead>
                  <TableHead>수용 인원</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>생성일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.id}</TableCell>
                    <TableCell className="font-medium">{t.tableNumber}</TableCell>
                    <TableCell>{t.capacity}명</TableCell>
                    <TableCell>
                      <Badge variant={t.isActive ? 'default' : 'secondary'}>
                        {t.isActive ? '활성' : '비활성'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(t.createdAt).toLocaleDateString('ko-KR')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
