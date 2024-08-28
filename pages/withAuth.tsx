import { JSX, useEffect} from 'react';
import {useRouter} from 'next/router';
import Cookies from 'js-cookie';  // Assuming you're storing your token in cookies

const withAuth = (WrappedComponent: () => React.JSX.Element) => {
    return (props: JSX.IntrinsicAttributes) => {
        const router = useRouter();
        const token = Cookies.get('authToken');  // Adjust this according to how you store your token

        useEffect(() => {
            if (!token) {
                router.replace('/');  // Redirect to login page if not authenticated
            }
        }, [token]);

        if (!token) {
            return null;  // Render nothing while redirecting
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
