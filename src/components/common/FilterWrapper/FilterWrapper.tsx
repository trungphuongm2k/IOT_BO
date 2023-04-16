import { Button, Col, Form, Input, Row } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { memo } from 'react';

function FilterWrapper({ children, updateFilter }: { children: any; updateFilter: any }) {
    return (
        <div
            className='w-full min-h-[80px] py-[20px] mt-[10px] '
            style={{ borderTop: '1px solid #0ea5e9' }}>
            <Form
                name='filter'
                layout='vertical'
                onFinish={updateFilter}
                style={{ width: '100%' }}
                requiredMark={false}>
                <Row className='w-full  h-fit'>{children}</Row>
                <Row className='w-full '>
                    <Col xs={12} sm={8} md={6} lg={4}>
                        <Form.Item className='mx-[5px] mt-[20px] mb-0'>
                            <div className='w-full flex '>
                                <Button type='primary' htmlType='submit' icon={<SearchOutlined />}>
                                    Tìm kiếm
                                </Button>
                            </div>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}

export default memo(FilterWrapper);
