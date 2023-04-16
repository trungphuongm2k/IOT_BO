import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import Loading from '../components/Loading';
import { checkMe } from '../store/slice/loginSlice';
import Login from '../components/login';

const AuthenticatedRoute = ({ children }: any) => {
    const router = useRouter();
    const { user, loading } = useAppSelector((state) => state.login);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(
            checkMe({
                type: 1,
                redirectUri: process.env.HOST_NAME_REDIRECT as string,
            })
        );
    }, []);

    const routeStart = () => {};
    const routeComplete = () => {};
    useEffect(() => {
        router.events.on('routeChangeStart', routeStart);
        router.events.on('routeChangeComplete', routeComplete);
        return () => {
            router.events.off('routeChangeStart', routeStart);
            router.events.off('routeChangeComplete', routeComplete);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            {loading && <Loading />}
            {user ? children : <Login />}
        </>
    );
};

export default AuthenticatedRoute;
