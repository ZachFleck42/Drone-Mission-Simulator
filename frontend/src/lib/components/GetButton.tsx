import React from 'react';
import axios, { AxiosResponse } from 'axios';

interface ButtonComponentProps {
	url: string;
}

const GetButton: React.FC<ButtonComponentProps> = ({ url }) => {
	const handleClick = async () => {
		try {
			const response: AxiosResponse = await axios.get(url);
			console.log('Response Data:', response.data);
		} catch (error) {
			console.error('Error:', error);
		}
	};

	return <button onClick={handleClick}>Make API GET request</button>;
};

export default GetButton;
