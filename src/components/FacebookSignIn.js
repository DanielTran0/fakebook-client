import React, { useState } from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';

import CircularProgress from '@material-ui/core/CircularProgress';

import { tokenRequests } from '../util/axiosRequests';
import { setUserDataProp } from '../util/customPropTypes';

const useStyles = makeStyles({
	button: {
		backgroundColor: '#4c69ba',
		color: 'white',
	},
});

const FacebookSignIn = ({ setUserData }) => {
	const { setUser, setToken } = setUserData;
	const [isLoading, setIsLoading] = useState(false);
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();

	const responseFacebook = async (response) => {
		if (!response.id) return null;

		setIsLoading(true);

		try {
			const userDataResponse = await tokenRequests.postFacebookLogin(
				response.accessToken
			);
			const { user } = userDataResponse.data;

			setIsLoading(false);
			setUser(user);
			return setToken(response.accessToken);
		} catch (error) {
			setIsLoading(false);
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
					disabled={isLoading}
					className={classes.button}
				>
					{isLoading ? (
						<CircularProgress color='secondary' />
					) : (
						<Typography>Login With Facebook</Typography>
					)}
				</Button>
			)}
		/>
	);
};

FacebookSignIn.propTypes = {
	setUserData: PropTypes.shape(setUserDataProp).isRequired,
};

export default FacebookSignIn;
