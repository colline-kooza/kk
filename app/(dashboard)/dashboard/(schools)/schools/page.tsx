import { getServerUser } from '@/actions/auth';
import SchoolsPage from '@/components/dashboard/school/SchoolsPage';
import { PageProtection } from '@/config/page-protection';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function page() {
     const user = await getServerUser();
      if (!user) {
        redirect("/auth/login");
      }
    
      await PageProtection.superAdminOnly(user);
  return (
    <div>
      <SchoolsPage/>
    </div>
  )
}
