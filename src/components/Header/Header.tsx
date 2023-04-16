import { useRouter } from 'next/router';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Form, Input } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector, useTrans } from '../../store/hooks';
import { setNavActive } from '../../store/slice/controlSlice';
import { changePassword, logout, logOut } from '../../store/slice/loginSlice';
import { getStoreLocal } from '../../utils/localStore';
import { BiBorderAll } from 'react-icons/bi';
const cx = classNames.bind(styles);

interface PropModal {
    loading: boolean;
    changePass: boolean;
    openModal: boolean;
    onFinish: any;
    onFinishFailed: any;
    handleCheckChangePass: any;
    setOpenModal: any;
}

function ModalHeader({
    loading,
    changePass,
    openModal,
    onFinish,
    onFinishFailed,
    handleCheckChangePass,
    setOpenModal,
}: PropModal): JSX.Element {
    const dispatch = useAppDispatch();
    const modalRef = useRef<any>(null);
    useEffect(() => {
        const handleClickOutSide = (event: any) => {
            if (event.target.classList.contains(cx('menu-overlay'))) return;
            if (modalRef && !modalRef.current.contains(event.target)) {
                if (!modalRef.current.classList.contains(cx('header-profile_hover--active')))
                    return;
                setOpenModal(false);
            }
        };
        document.addEventListener('click', handleClickOutSide);
        return () => {
            document.removeEventListener('click', handleClickOutSide);
        };
    }, []);
    return (
        <div
            className={cx(
                'header-profile_hover',
                `${changePass ? 'is-change-pass' : ''}`,
                `${openModal ? 'header-profile_hover--active' : ''}`
            )}
            ref={modalRef}>
            <div className={cx('header-profile_control')}>
                <span
                    className={cx(`${!changePass ? 'active' : ''}`)}
                    onClick={() => handleCheckChangePass('logout')}>
                    Đăng xuất
                </span>
                <span
                    className={cx(`${changePass ? 'active' : ''}`)}
                    onClick={() => handleCheckChangePass('changepass')}>
                    Đổi mật khẩu
                </span>
            </div>
            <div className={cx('header-profile_main')}>
                {!changePass ? (
                    <div className={cx('header-profile_logout')}>
                        <Button
                            type='primary'
                            htmlType='submit'
                            size='small'
                            danger
                            onClick={() => {
                                dispatch(
                                    logout({
                                        refreshToken: getStoreLocal('refresh_token') as string,
                                    })
                                );
                                dispatch(logOut());
                            }}>
                            Đăng xuất
                        </Button>
                    </div>
                ) : (
                    <div className={cx('header-profile_changepass')}>
                        <p className='text-sm font-semibold'>
                            Vui lòng liên hệ admin để đổi mật khẩu !!!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function Header(): JSX.Element {
    const { pathname } = useRouter();
    const { isNavActive } = useAppSelector((state) => state.control);
    const dispatch = useAppDispatch();

    const [checkPageLogin, setCheckPageLogin] = useState(false);
    const [changePass, setChangePass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const { user } = useAppSelector((state) => state.login);

    const handleCheckChangePass = (option: string) => {
        if (option == 'logout') {
            if (!changePass) return;
            setChangePass(false);
        }
        if (option == 'changepass') {
            if (changePass) return;
            setChangePass(true);
        }
    };

    useEffect(() => {
        if (pathname != '/login') {
            setCheckPageLogin(true);
        } else {
            setCheckPageLogin(false);
        }
    }, [pathname]);

    const onFinish = async (values: any) => {
        setLoading(true);
        const { newpassword } = values;
        dispatch(
            changePassword({
                id: user?.id,
                password: newpassword,
            })
        ).then(() => {
            setLoading(false);
        });
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <>
            {checkPageLogin && (
                <>
                    <header className={`${cx('header')} px-[10px] relative justify-between `}>
                        <div className='h-full p-[10px] absolute top-0 left-[50%] translate-x-[-50%] hidden tablet:block'>
                            {/* ---- */}
                        </div>
                        <div
                            className={`${cx('header-menu')} ${
                                isNavActive && cx('header-menu--active')
                            } h-full flex items-center`}>
                            <div
                                onClick={() => dispatch(setNavActive(!isNavActive))}
                                style={{
                                    boxShadow:
                                        ' rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
                                }}
                                className=' w-[30px] cursor-pointer h-[30px] flex items-center justify-center border-2	border-inherit rounded-md'>
                                <img
                                    className='w-full object-contain'
                                    src='/icon-menu.svg'
                                    alt='menu'
                                />
                            </div>
                        </div>
                        <div className='h-full flex items-center'>
                            <div className={cx('header-profile')}>
                                <div className={cx('header-profile_show')}>
                                    <Avatar
                                        style={{
                                            backgroundColor: '#ff9900',
                                            verticalAlign: 'middle',
                                            marginRight: '5px',
                                        }}
                                        gap={1}
                                        icon={<UserOutlined />}
                                    />

                                    <div className='h-[50px] text-[#fff] p-[5px] text-xs'>
                                        <p className='m-0 font-semibold'>
                                            {user && (user.username || '')}
                                        </p>
                                        <p className='m-0'>{user && (user.email || '')}</p>
                                    </div>
                                    <div
                                        onClick={() => {
                                            setOpenModal(!openModal);
                                        }}
                                        className={`${cx(
                                            'menu'
                                        )} w-[40px] h-[40px] flex justify-center items-center relative ${
                                            openModal ? cx('active') : ''
                                        }`}>
                                        <BiBorderAll className={` text-[#fff] `} />
                                        <div
                                            className={`${cx(
                                                'menu-overlay'
                                            )} absolute top-0 left-0 w-full h-full`}></div>
                                    </div>
                                </div>
                                <ModalHeader
                                    loading={loading}
                                    changePass={changePass}
                                    openModal={openModal}
                                    onFinish={onFinish}
                                    onFinishFailed={onFinishFailed}
                                    handleCheckChangePass={handleCheckChangePass}
                                    setOpenModal={setOpenModal}
                                />
                            </div>
                        </div>
                    </header>
                </>
            )}
        </>
    );
}

export default Header;
