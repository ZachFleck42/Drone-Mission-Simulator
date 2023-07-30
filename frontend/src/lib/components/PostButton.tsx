import React from 'react';
import axios, { AxiosResponse } from 'axios';

interface ButtonComponentProps {
	url: string;
	postData: object;
}

const PostButton: React.FC<ButtonComponentProps> = ({ url, postData }) => {
	const handleClick = async () => {
		try {
			const response: AxiosResponse = await axios.post(url, postData);
			console.log('Response Data:', response.data);
		} catch (error) {
			console.error('Error:', error);
		}
	};

	return <button onClick={handleClick}>Make API POST request</button>;
};

export default PostButton;
