import { useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Login.module.scss';
import { useRouter } from 'next/router';
import { BiLogInCircle } from 'react-icons/bi';
import { useAppDispatch } from '../../store/hooks';
import { checkMe, login } from '../../store/slice/loginSlice';
import { getLoginLink } from '../../service/api/loginService';
const cx = classNames.bind(styles);

const Login = () => {
    const { query, push } = useRouter();
    const dispatch = useAppDispatch();
    const redirectUri = process.env.HOST_NAME_REDIRECT;
    const handleLogin = async () => {
        const { url } = await getLoginLink(redirectUri as string);
        const windowFeatures = 'menubar=no,location=no,resizable=yes,scrollbars=yes,status=yes';
        window.open(url, '_parent', windowFeatures);
    };

    useEffect(() => {
        const { code } = query;
        if (!code) return;
        dispatch(
            login({
                code: code as string,
                redirectUri: redirectUri as string,
            })
        ).finally(() => {
            dispatch(
                checkMe({
                    type: 2,
                    redirectUri: redirectUri as string,
                })
            ).finally(() => {
                push('/');
            });
        });
    }, [query]);

    return (
        <>
            <main className={cx('login')}>
                <div className={` ${cx('container')} `}>
                    <div className={cx('contact')}>
                        <div className={cx('logo')}>
                            <img src='/vfast-video.png' alt='Logo vaiv eco' />
                        </div>
                    </div>
                    <div className={cx('main')}>
                        <h1>VAIV BO</h1>
                        <button onClick={() => handleLogin()}>
                            <div className={cx('icon')}>
                                <BiLogInCircle />
                            </div>
                            <div className={cx('title')}>
                                <span>Đăng nhập vào hệ thống</span>
                            </div>
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
};
export default Login;
