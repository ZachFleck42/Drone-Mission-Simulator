import { useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import playSVG from '../assets/icons/play.svg';
import pauseSVG from '../assets/icons/pause.svg';
import replaySVG from '../assets/icons/replay.svg';

interface FrameControlsProps {
	maxFrames: number;
	currentFrameIndex: number;
	setCurrentFrameIndex: React.Dispatch<React.SetStateAction<number>>;
	isPlaying: boolean;
	setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FrameControls({
	maxFrames: noFrames,
	currentFrameIndex,
	setCurrentFrameIndex,
	isPlaying,
	setIsPlaying,
}: FrameControlsProps) {
	const frameLimit = noFrames - 1;

	const togglePlayPause = () => {
		if (currentFrameIndex === frameLimit) {
			setCurrentFrameIndex(0);
		}
		setIsPlaying((prevState) => !prevState);
	};

	const handleSliderChange = (value: number | number[]) => {
		if (typeof value === 'number') {
			setCurrentFrameIndex(value);
		} else if (Array.isArray(value) && value.length > 0) {
			setCurrentFrameIndex(value[0]);
		}
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
			}, 750);
		}

		return () => {
			clearInterval(intervalId);
		};
	}, [isPlaying, frameLimit, setCurrentFrameIndex]);

	return (
		<div className="sim-frame-controls">
			<div className="sim-frame-controls-buttons">
				<button
					className="sim-frame-controls-button-max-frame"
					onClick={() => setCurrentFrameIndex(0)}
					disabled={isPlaying || currentFrameIndex === 0}>
					&lt;&lt;
				</button>
				<button
					className="sim-frame-controls-button-single-frame"
					onClick={() => setCurrentFrameIndex((prevIndex) => prevIndex - 1)}
					disabled={isPlaying || currentFrameIndex === 0}>
					&lt;
				</button>
				<button
					className="sim-frame-controls-button-play"
					onClick={togglePlayPause}>
					{currentFrameIndex === frameLimit ? (
						<img
							className="sim-frame-controls-button-replay-icon"
							src={replaySVG}
						/>
					) : isPlaying ? (
						<img
							className="sim-frame-controls-button-pause-icon"
							src={pauseSVG}
						/>
					) : (
						<img
							className="sim-frame-controls-button-play-icon"
							src={playSVG}
						/>
					)}
				</button>

				<button
					className="sim-frame-controls-button-single-frame"
					onClick={() => setCurrentFrameIndex((prevIndex) => prevIndex + 1)}
					disabled={isPlaying || currentFrameIndex === frameLimit}>
					&gt;
				</button>
				<button
					className="sim-frame-controls-button-max-frame"
					onClick={() => setCurrentFrameIndex(frameLimit)}
					disabled={isPlaying || currentFrameIndex === frameLimit}>
					&gt;&gt;
				</button>
			</div>
			<Slider
				value={currentFrameIndex}
				min={0}
				max={frameLimit}
				onChange={(value) => handleSliderChange(value)}
			/>
			<div className="sim-frame-controls-frame-readout">
				{currentFrameIndex} / {frameLimit}
			</div>
		</div>
	);
}
