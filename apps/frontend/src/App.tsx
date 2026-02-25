import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter, 
  Input,
  Label,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  Toaster,
  Mail,
  Lock,
  Plus,
  Search,
  Trash2,
  Edit,
  Settings,
  Heart,
} from '@hai-s/design-system';
import { toast } from 'sonner';

function App() {
  return (
    <div className="min-h-screen bg-primary-1 p-8">
      <Toaster />
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-primary-12">Design System Demo</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Welcome to HAI-S Design System</CardTitle>
            <CardDescription>
              Primary color 기반으로 자동 생성된 12단계 색상 scale을 사용합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-11" />
                <Input id="email" type="email" placeholder="example@email.com" className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-11" />
                <Input id="password" type="password" placeholder="••••••••" className="pl-10" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="gap-2">
            <Button onClick={() => toast.success('로그인 성공!')}>로그인</Button>
            <Button variant="outline">취소</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
            <CardDescription>다양한 버튼 스타일을 확인해보세요</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="default">
              <Plus className="w-4 h-4 mr-2" />
              Default
            </Button>
            <Button variant="secondary">
              <Search className="w-4 h-4 mr-2" />
              Secondary
            </Button>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Outline
            </Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Destructive
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Heart className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dialog & Toast</CardTitle>
            <CardDescription>Dialog와 Toast 컴포넌트 예제</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>프로필 수정</DialogTitle>
                  <DialogDescription>
                    프로필 정보를 수정하세요.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input id="name" placeholder="홍길동" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">취소</Button>
                  <Button>저장</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button onClick={() => toast('기본 알림')}>Show Toast</Button>
            <Button onClick={() => toast.success('성공!')}>Success Toast</Button>
            <Button onClick={() => toast.error('에러!')}>Error Toast</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Color Scale</CardTitle>
            <CardDescription>Primary color의 12단계 scale</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-12 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                <div key={i} className="space-y-1">
                  <div 
                    className="h-16 rounded border border-primary-6"
                    style={{ backgroundColor: `var(--primary-${i})` }}
                  />
                  <p className="text-xs text-center">{i}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
