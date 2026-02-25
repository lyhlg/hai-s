import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Admin App - TODO: Phase 1 (개발자 D)</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
