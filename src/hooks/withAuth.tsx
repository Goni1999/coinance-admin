import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const withAuth = (WrappedComponent: any, allowedRoles: string[]) => {
  return (props: any) => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const userRole = sessionStorage.getItem("role");

      if (!userRole || !allowedRoles.includes(userRole)) {
        router.replace("/unauthorized"); // Redirect if not allowed
      } else {
        setIsAuthorized(true);
      }
    }, []);

    if (!isAuthorized) return null; // Prevent rendering before checking

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
