import { Button, Modal } from 'antd';
import { memo } from 'react';

function ModalWrapper({
    children,
    title,
    isOpen,
    onCancel,
    submitBtnRef,
    loadingApi,
    titleBtn,
}: any) {
    return (
        <Modal
            title={
                <div className='h-[60px] '>
                    <h2 className='text-center text-lg'>{title}</h2>
                </div>
            }
            open={isOpen}
            onCancel={() => onCancel()}
            footer={[
                <Button type='primary' danger key='back' onClick={() => onCancel()}>
                    Cancel
                </Button>,
                <Button
                    type='primary'
                    key='submit'
                    loading={false}
                    onClick={() => {
                        submitBtnRef.current.submit();
                    }}>
                    {titleBtn}
                </Button>,
            ]}
            width={1440}>
            {children}
        </Modal>
    );
}

export default memo(ModalWrapper);
