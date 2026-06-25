import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar user={session} />
      <div className="flex-1 flex flex-col">
        <Header user={session} />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
