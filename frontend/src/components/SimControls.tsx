import { useEffect } from 'react';

export default function SimControls({
	maxFrames,
	currentFrameIndex,
	setCurrentFrameIndex,
	isPlaying,
	setIsPlaying,
}: {
	maxFrames: number;
	currentFrameIndex: number;
	setCurrentFrameIndex: React.Dispatch<React.SetStateAction<number>>;
	isPlaying: boolean;
	setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const frameLimit = maxFrames - 1;

	const togglePlayPause = () => {
		if (currentFrameIndex === frameLimit) {
			setCurrentFrameIndex(0);
		}
		setIsPlaying((prevState) => !prevState);
	};

	useEffect(() => {
		let intervalId: NodeJS.Timeout;

		if (isPlaying) {
			intervalId = setInterval(() => {
				setCurrentFrameIndex((prevIndex) => {
					const nextIndex = prevIndex + 1;
					if (nextIndex > frameLimit) {
						setIsPlaying(false);
						return frameLimit;
					}
					return nextIndex;
				});
			}, 500);
		}

		return () => {
			clearInterval(intervalId);
		};
	}, [isPlaying, frameLimit, setCurrentFrameIndex]);

	return (
		<div className="frame-buttons">
			<button
				onClick={() => setCurrentFrameIndex(0)}
				disabled={isPlaying || currentFrameIndex === 0}>
				&lt; &lt;
			</button>
			<button
				onClick={() => setCurrentFrameIndex((prevIndex) => prevIndex - 1)}
				disabled={isPlaying || currentFrameIndex === 0}>
				&lt;
			</button>
			<span>
				{currentFrameIndex} / {frameLimit}
			</span>
			<button
				onClick={() => setCurrentFrameIndex((prevIndex) => prevIndex + 1)}
				disabled={isPlaying || currentFrameIndex === frameLimit}>
				&gt;
			</button>
			<button
				onClick={() => setCurrentFrameIndex(frameLimit)}
				disabled={isPlaying || currentFrameIndex === frameLimit}>
				&gt; &gt;
			</button>
			<button onClick={togglePlayPause}>
				{currentFrameIndex === frameLimit
					? 'Replay'
					: isPlaying
					? 'Pause'
					: 'Play'}
			</button>
		</div>
	);
}
