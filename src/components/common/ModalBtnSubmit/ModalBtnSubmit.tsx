import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Button, Form } from 'antd';

function ModalBtnSubmit({ loading }: { loading: any }, ref: any) {
    const btnRef = useRef<any>();
    useImperativeHandle(ref, () => ({
        submit: () => {
            btnRef.current.click();
        },
    }));
    return (
        <Form.Item>
            <div className='w-full hidden items-center justify-center'>
                <Button ref={btnRef} type='primary' htmlType='submit' loading={loading} danger>
                    oke
                </Button>
            </div>
        </Form.Item>
    );
}

export default forwardRef(ModalBtnSubmit);
