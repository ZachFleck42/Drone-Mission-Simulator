import React from 'react';
import axios, { AxiosResponse } from 'axios';

interface ButtonComponentProps {
	buttonText: string;
	url: string;
	postData: object;
}

const PostButton: React.FC<ButtonComponentProps> = ({
	buttonText,
	url,
	postData,
}) => {
	const handleClick = async () => {
		try {
			const response: AxiosResponse = await axios.post(url, postData);
			console.log(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	return <button onClick={handleClick}>{buttonText}</button>;
};

export default PostButton;
