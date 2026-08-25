import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
