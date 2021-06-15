import { formatDistanceStrict, format, isYesterday, parseJSON } from 'date-fns';

const formatDate = (unformattedDate, isComment) => {
	const baseDate = parseJSON(new Date(unformattedDate));
	const currentDate = parseJSON(Date.now());
	const formattedDate = format(baseDate, 'MMMM d p').split(' ');
	const minuteDifference = formatDistanceStrict(baseDate, currentDate, {
		unit: 'minute',
	}).split(' ');
	const hourDifference = formatDistanceStrict(baseDate, currentDate, {
		unit: 'hour',
	}).split(' ');
	const isDateYesterday = isYesterday(baseDate);

	if (minuteDifference[0] <= 1) return 'Just Now';
	if (minuteDifference[0] < 60) return `${minuteDifference[0]}m`;
	if (hourDifference[0] < 24 && !isDateYesterday)
		return `${hourDifference[0]}h`;
	if (isComment) return format(baseDate, 'MMMM d');
	if (isDateYesterday) return `Yesterday at ${format(baseDate, 'p')}`;

	formattedDate.splice(2, 0, 'at');
	return `${formattedDate.join(' ')}`;
};

export default formatDate;
