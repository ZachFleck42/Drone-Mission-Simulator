import React from 'react';
import axios, { AxiosResponse } from 'axios';

interface ButtonComponentProps {
	buttonText: string;
	url: string;
	data: object;
	onPost: (responseData: any) => void;
}

const PostButton: React.FC<ButtonComponentProps> = ({
	buttonText,
	url,
	data,
	onPost,
}) => {
	const handleClick = async () => {
		try {
			const response: AxiosResponse = await axios.post(url, data);
			onPost(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	return <button onClick={handleClick}>{buttonText}</button>;
};

export default PostButton;
