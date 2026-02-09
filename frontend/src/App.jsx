import { BrowserRouter, Routes, Route } from "react-router-dom";
import Upload from "./pages/Upload.jsx";
import Study from "./pages/Study.jsx";
import Download from "./pages/Download.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Upload />} />
        <Route path="/study" element={<Study />} />
        <Route path="/download" element={<Download />} />
      </Routes>
    </BrowserRouter>
  );
}
