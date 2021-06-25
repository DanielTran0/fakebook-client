import React from 'react';
import PropTypes from 'prop-types';
import dotenv from 'dotenv';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';

import { sessionRequests } from '../util/axiosRequests';
import { setUserDataProp } from '../util/customPropTypes';

dotenv.config();

const useStyles = makeStyles({
	button: { marginTop: 15, backgroundColor: '#e69b02' },
	text: { color: 'white' },
});

const TestUserLogin = ({ setUserData }) => {
	const { setUser, setToken } = setUserData;
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();

	const handleTestUserLogin = async () => {
		try {
			const loginResponse = await sessionRequests.postNewSession({
				email: process.env.REACT_APP_TEST_USER_EMAIL,
				password: process.env.REACT_APP_TEST_USER_PASSWORD,
			});
			const { user, token } = loginResponse.data;

			setUser(user);
			setToken(token);
		} catch (error) {
			enqueueSnackbar(error.message, { variant: 'error' });
		}
	};

	return (
		<Button
			variant='contained'
			fullWidth
			onClick={handleTestUserLogin}
			className={classes.button}
		>
			<Typography className={classes.text}>Test User Login</Typography>
		</Button>
	);
};

TestUserLogin.propTypes = {
	setUserData: PropTypes.shape(setUserDataProp).isRequired,
};

export default TestUserLogin;
