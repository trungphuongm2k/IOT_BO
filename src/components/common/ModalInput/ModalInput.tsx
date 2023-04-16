import { Col, Form, Input } from 'antd';
import { memo } from 'react';

function ModalInput({
    layout,
    label,
    name,
    required,
    disabled,
    rule,
}: {
    layout: any;
    label: string;
    name: string;
    required?: boolean | undefined;
    disabled?: boolean;
    rule?: any;
}) {
    const rules = () => {
        let ruleInit = [
            {
                required: required,
                message: 'Không bỏ trống!!!',
            },
        ];
        if (rule) {
            ruleInit = [...rule, ...ruleInit];
        }
        return ruleInit;
    };
    return (
        <Col {...layout}>
            <Form.Item
                wrapperCol={{ span: 24 }}
                labelCol={{ span: 24 }}
                label={<span className='text-base font-semibold'>{label}</span>}
                name={name}
                rules={rules()}>
                <Input disabled={disabled} allowClear />
            </Form.Item>
        </Col>
    );
}

export default memo(ModalInput);
