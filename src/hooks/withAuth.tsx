import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent: any, allowedRoles: string[]) => {
  return (props: any) => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const userRole = sessionStorage.getItem("role");

      if (!userRole || !allowedRoles.includes(userRole)) {
        router.replace("/unauthorized"); 
      } else {
        setIsAuthorized(true);
      }
    }, []);

    if (!isAuthorized) return null; 

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
