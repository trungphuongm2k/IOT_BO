import { Button } from 'antd';
import { PlusCircleFilled, ReloadOutlined } from '@ant-design/icons';

function MainLayout({ children, title, reLoadCb, addRecordCb, loading, namePage }: any) {
    return (
        <>
            {loading && (
                <div
                    style={{
                        backgroundColor: 'rgba(181, 181, 181, 0.307)',
                        backdropFilter: 'blur(1px)',
                    }}
                    className='fixed top-0 left-0  w-full h-full z-[999999] flex justify-center items-center'>
                    <img src='/loading.svg' className='' alt='loading' />
                </div>
            )}
            <div className='w-full pb-[200px] relative'>
                <div className='py-[10px]'>
                    <h1
                        className='font-bold text-2xl uppercase text-[#fff] drop-shadow-2xl'
                        style={{
                            textShadow: '1px 1px 2px red, 0 0 1em #7486ff, 0 0 0.1em #7486ff',
                        }}>
                        {title}
                    </h1>
                </div>
                <div
                    className='w-full bg-white p-[20px]'
                    style={{
                        boxShadow:
                            'rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px',
                    }}>
                    <div className='flex gap-1  flex-row-reverse'>
                        <Button type='text' size='middle' onClick={() => reLoadCb()}>
                            <div className='flex justify-center items-center gap-2'>
                                <ReloadOutlined />
                                Tải lại dữ liệu
                            </div>
                        </Button>
                        <Button type='primary' size='middle' onClick={() => addRecordCb()}>
                            <div className='flex justify-center items-center gap-2'>
                                <PlusCircleFilled />
                                {`Thêm mới ${namePage}`}
                            </div>
                        </Button>
                    </div>
                    {children}
                </div>
            </div>
        </>
    );
}

export default MainLayout;
