import React from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';

import { sessionRequests } from '../util/axiosRequests';
import { setUserDataProp } from '../util/customPropTypes';

const useStyles = makeStyles({
	button: {
		backgroundColor: '#4c69ba',
		color: 'white',
	},
});

const FacebookSignIn = ({ setUserData }) => {
	const { setUser, setToken } = setUserData;
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();

	const responseFacebook = async (response) => {
		if (!response.id) return null;

		setToken(response.accessToken);

		try {
			const userDataResponse = await sessionRequests.postFacebookLogin();
			const { user } = userDataResponse.data;

			return setUser(user);
		} catch (error) {
			return enqueueSnackbar(error.message, { variant: 'error' });
		}
	};

	return (
		<FacebookLogin
			appId='205844311384443'
			fields='name, email, picture'
			callback={responseFacebook}
			render={(renderProps) => (
				<Button
					variant='contained'
					fullWidth
					onClick={renderProps.onClick}
					className={classes.button}
				>
					<Typography>Login With Facebook</Typography>
				</Button>
			)}
		/>
	);
};

FacebookSignIn.propTypes = {
	setUserData: PropTypes.shape(setUserDataProp).isRequired,
};

export default FacebookSignIn;
