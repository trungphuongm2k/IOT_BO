import { Col, Form, Select } from 'antd';
import { memo } from 'react';
const { Option } = Select;

interface Props {
    label: string;
    placeholder: string;
    name: any;
    listOption: { id: number | boolean | string; title: string }[];
}

const OptionSearch = ({ placeholder, listOption, label, name }: Props) => {
    return (
        <Col className='pt-[10px] px-[5px]' xs={12} sm={8} md={6} lg={4}>
            <Form.Item label={label} name={name} className='m-0'>
                <Select allowClear placeholder={placeholder}>
                    {listOption.length > 0 &&
                        listOption.map((op) => (
                            <Option key={op.id.toString()} value={op.id}>
                                {op.title}
                            </Option>
                        ))}
                </Select>
            </Form.Item>
        </Col>
    );
};

export default memo(OptionSearch);
