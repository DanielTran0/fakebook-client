import { format, parseJSON } from 'date-fns';

const formatTime = (unformattedDate) => {
	const baseDate = parseJSON(unformattedDate);
	return format(baseDate, 'p');
};

export default formatTime;
