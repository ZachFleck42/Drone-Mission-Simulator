import Toggle from 'react-toggle';

export default function ({
	threeD,
	setThreeD,
}: {
	threeD: boolean;
	setThreeD: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	return (
		<Toggle
			icons={false}
			defaultChecked={true}
			onChange={() => {
				setThreeD(!threeD);
			}}
		/>
	);
}
