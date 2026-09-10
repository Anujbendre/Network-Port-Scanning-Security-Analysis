import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Sidebar />

      <div className="ml-64">

        <Header />

        <Dashboard />

      </div>

    </div>
  );
}

export default App;