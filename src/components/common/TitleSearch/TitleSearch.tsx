import { Col, Form, Input } from 'antd';
import { memo } from 'react';

interface Props {
    label: string;
    name: string;
    placeholder: string;
}

const TitleSearch = ({ name, label, placeholder }: Props) => {
    return (
        <Col className='pt-[10px] px-[5px]' xs={12} sm={8} md={6} lg={4}>
            <Form.Item label={label} name={name} className='m-0'>
                <Input allowClear placeholder={placeholder} />
            </Form.Item>
        </Col>
    );
};

export default memo(TitleSearch);
