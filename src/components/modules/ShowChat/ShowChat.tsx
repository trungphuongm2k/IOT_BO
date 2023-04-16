import classNames from 'classnames/bind';
import { memo, useEffect, useRef } from 'react';
import { ChatGpt } from '../../../interface';
import styles from './ShowChat.module.scss';
const cx = classNames.bind(styles);

interface Props {
    loading: boolean;
    listResult: {
        question: string;
        result: ChatGpt;
    }[];
}
function ShowChat({ listResult, loading }: Props) {
    const blockChatRef = useRef<any>(null);
    useEffect(() => {
        if (blockChatRef.current) {
            console.log(blockChatRef.current.scrollHeight);

            blockChatRef.current.scrollIntoView({
                top: blockChatRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [listResult, loading]);
    return (
        <div className={`w-full max-w-[900px] m-auto ${cx('wrapper-show-chat')}`}>
            <div ref={blockChatRef} className={`w-full ${cx('wrapper-show-chat_main')} `}>
                {loading && (
                    <div className='w-[200px] h-fit p-[15px] bg-[#fff] mt-[30px] ml-[100px] shadow-xl rounded-lg relative'>
                        <div className={cx('chat-style')}></div>
                        <div className={cx('chat-avt')}>
                            <img src='/robot.png' alt='robot' className='w-full h-full' />
                        </div>
                        <img
                            src='/loading.gif'
                            alt='gif'
                            className='w-full h-[50px] object-cover'
                        />
                    </div>
                )}
                <div className='w-full flex flex-col-reverse'>
                    {listResult.length > 0 &&
                        listResult.map((chat, index) => (
                            <div
                                key={index}
                                className='w-[780px] h-fit p-[15px] bg-[#fff] mt-[20px] ml-[100px] shadow-xl rounded-lg relative'>
                                <div className={cx('chat-style')}></div>
                                <div className={cx('chat-avt')}>
                                    <img src='/robot.png' alt='robot' className='w-full h-full' />
                                </div>
                                <p
                                    className={`text-[#0064e7] text-xs font-semibold overflow-hidden ${cx(
                                        'question'
                                    )}`}>
                                    {chat.question}
                                </p>
                                {chat.result.content}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

export default memo(ShowChat);
