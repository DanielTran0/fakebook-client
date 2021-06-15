import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import SignInForm from '../components/forms/SignInForm';
import ModalSignUpForm from '../components/forms/ModalSignUpForm';

import { userDataProp, setUserDataProp } from '../util/customPropTypes';
import useStyles from '../util/useStylesHook';

const Login = ({ userData, setUserData }) => {
	const { token } = userData;
	const classes = useStyles();

	if (token) return <Redirect to='/' />;

	return (
		<div className='login'>
			<Container maxWidth='sm'>
				<Typography variant='h4' color='primary' align='center'>
					fakebook
				</Typography>
				<Typography variant='body1' align='center'>
					Connect with friends and the world around you on Facebook.
				</Typography>
			</Container>

			<Container maxWidth='xs'>
				<SignInForm setUserData={setUserData} />

				<Divider className={classes.bottomSpacing} />

				<ModalSignUpForm setUserData={setUserData} />
			</Container>
		</div>
	);
};

Login.propTypes = {
	userData: PropTypes.shape(userDataProp).isRequired,
	setUserData: PropTypes.shape(setUserDataProp).isRequired,
};

export default Login;
