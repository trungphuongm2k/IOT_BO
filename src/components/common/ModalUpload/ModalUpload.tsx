import { Button, Col, Form, Input, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { memo } from 'react';
function ModalUpload({
    layout,
    label,
    name,
    required,
    accept,
}: {
    layout: any;
    label?: string;
    name: string;
    required: boolean | undefined;
    accept?: string;
}) {
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    return (
        <Col {...layout}>
            <Form.Item
                wrapperCol={{ span: 24 }}
                label={<span className='text-base font-semibold'>{label}</span>}
                name={name}
                valuePropName='fileList'
                getValueFromEvent={normFile}
                rules={[
                    {
                        required: required,
                        message: 'Không bỏ trống!!!',
                    },
                ]}>
                <Upload
                    maxCount={1}
                    listType='picture'
                    multiple={false}
                    beforeUpload={() => {
                        return false;
                    }}
                    withCredentials={false}
                    showUploadList={true}
                    accept={accept}>
                    <Button icon={<UploadOutlined />}>{label}</Button>
                </Upload>
            </Form.Item>
        </Col>
    );
}

export default memo(ModalUpload);
