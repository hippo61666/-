import { Routes, Route } from 'react-router-dom';
import BrandKitEditor from '@/pages/BrandKitEditor';
import VideoGenerator from '@/pages/VideoGenerator';

// Placeholder components
const Dashboard = () => <div className="p-8"><h1 className="text-2xl font-bold">工作台 (Dashboard)</h1></div>;
const VideoLibrary = () => <div className="p-8"><h1 className="text-2xl font-bold">视频库 (Video Library)</h1></div>;

function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <main className="w-full h-full">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/brand-kits" element={<BrandKitEditor />} />
          <Route path="/brand-kits/:id" element={<BrandKitEditor />} />
          <Route path="/generate" element={<VideoGenerator />} />
          <Route path="/library" element={<VideoLibrary />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
