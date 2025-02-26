"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface ProtectedRouteProps {
  requiredRole: string;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole, children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    
    // If no session or the role doesn't match, redirect
    if (!session || !session?.user?.role || session.user.role !== requiredRole) {
      router.push("/signin");
    } else {
      setLoading(false);
    }
  }, [session, status, router, requiredRole]);

  if (loading) {
    return     <div className="flex flex-col flex-1 lg:w-1/2 w-full">
<div className="text-center text-gray-700 dark:text-white">Loading...</div>
</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
