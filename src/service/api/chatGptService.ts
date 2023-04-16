import axiosClient from '../axiosClient';

export const questionFromUser = async (question: string) => {
    const res = await axiosClient.get(`/chatgpt/question`, {
        params: {
            content: question,
        },
    });
    return res.data;
};
