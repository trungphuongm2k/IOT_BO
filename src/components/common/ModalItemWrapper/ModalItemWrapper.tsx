import { Col, Form } from 'antd';
import { memo } from 'react';

function ModalItemWrapper({
    children,
    layout,
    label,
    name,
    extra,
    required,
    valuePropName,
    help,
    rule,
}: {
    children: any;
    layout?: any;
    label?: string;
    name?: string;
    extra?: any;
    required?: boolean | undefined;
    valuePropName?: string;
    help?: string;
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
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                label={<span className='text-base font-semibold'>{label}</span>}
                name={name}
                extra={extra}
                valuePropName={valuePropName}
                help={help}
                rules={rules()}>
                {children}
            </Form.Item>
        </Col>
    );
}

export default memo(ModalItemWrapper);
