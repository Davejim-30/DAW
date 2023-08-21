import { Navigate, useRoutes } from 'react-router-dom';
import Rutinas from '../pages/Rutinas';
import Perfil from '../pages/Perfil';
import Dietas from '../pages/Dietas';
import Blogs from '../pages/Blogs';
import Admin from '../pages/Admin';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import PageWrapper from '../components/PageWrapper';
import Header from '../components/Header';
import { useIdentity } from './IdentityProvider';

// AuthRoute component
const AuthRoute = ({ children }) => {
    const { user } = useIdentity();
    return user ? children : <Navigate to="/signin" replace={true} />;
};

// NonAuthRoute component
const NonAuthRoute = ({ children }) => {
    const { user } = useIdentity();
    return user ? <Navigate to="/" replace={true} /> : children;
};

// RouteProvider component
function RouteProvider() {
    const routes = useRoutes([
        {
            path: '/',
            element: (
                <AuthRoute>
                    <Header />
                    <PageWrapper >
                        <Rutinas />
                    </PageWrapper>
                </AuthRoute>
            ),
        },
        {
            path: '/rutinas',
            element: (
                <AuthRoute>
                    <Header />
                    <PageWrapper linksFondos='/imagenes/rutinaL.JPG'>
                        <Rutinas />
                    </PageWrapper>
                </AuthRoute>
            ),
        },
        {
            path: '/perfil',
            element: (
                <AuthRoute>
                    <Header />
                    <PageWrapper>
                        <Perfil />
                    </PageWrapper>
                </AuthRoute>
            ),
        },
        {
            path: '/dietas',
            element: (
                <AuthRoute>
                    <Header />
                    <PageWrapper>
                        <Dietas />
                    </PageWrapper>
                </AuthRoute>
            ),
        },
        {
            path: '/blogs',
            element: (
                <AuthRoute>
                    <Header />
                    <PageWrapper>
                        <Blogs />
                    </PageWrapper>
                </AuthRoute>
            ),
        },
        {
            path: '/admin',
            element: (
                <AuthRoute>
                    <Header />
                    <PageWrapper>
                        <Admin />
                    </PageWrapper>
                </AuthRoute>
            ),
        },
        {
            path: '/signin',
            element: (
                <NonAuthRoute>
                    <PageWrapper>
                        <SignIn />
                    </PageWrapper>
                </NonAuthRoute>
            ),
        },
        {
            path: '/signup',
            element: (
                <NonAuthRoute>
                    <PageWrapper>
                        <SignUp />
                    </PageWrapper>
                </NonAuthRoute>
            ),
        },
    ]);

    return routes;
}

export default RouteProvider;
