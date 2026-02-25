import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Customer App - TODO: Phase 1 (개발자 C)</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
