"use client"; 

import { useEffect, useState, ComponentType } from "react";
import { useRouter } from "next/navigation";

const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>,
  allowedRoles: string[]
) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null); // Start as "loading"

    useEffect(() => {
      const role = sessionStorage.getItem("role"); 

      if (!role || !allowedRoles.includes(role)) {
        router.push("/signin");
      } else {
        setIsAuthorized(true);
      }
    }, []);

    // ✅ Show loading screen while checking authentication
    if (isAuthorized === null) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      );
    }

    // ✅ Render page only after authorization is confirmed
    return isAuthorized ? <WrappedComponent {...props} /> : null;
  };

  AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return AuthComponent;
};

export default withAuth;
