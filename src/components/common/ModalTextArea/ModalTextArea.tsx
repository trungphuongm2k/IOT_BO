import { Col, Form, Input } from 'antd';
import { memo } from 'react';

const { TextArea } = Input;

function ModalInput({
    layout,
    label,
    name,
    required,
    rule,
    help,
    disabled,
}: {
    layout: any;
    label?: string;
    name: string;
    required: boolean | undefined;
    rule?: any;
    help?: string;
    disabled?: boolean;
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
                label={<span className='text-base font-semibold'>{label}</span>}
                name={name}
                rules={rules()}
                help={help}>
                <TextArea allowClear showCount style={{ minHeight: 100 }} disabled={disabled} />
            </Form.Item>
        </Col>
    );
}

export default memo(ModalInput);
