import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';

import FacebookSignIn from '../components/FacebookSignIn';
import ModalSignUpForm from '../components/forms/ModalSignUpForm';
import SignInForm from '../components/forms/SignInForm';
import TestUserLogin from '../components/TestUserLogin';

import { userDataProp, setUserDataProp } from '../util/customPropTypes';

const useStyles = makeStyles({
	grid: { marginTop: 60 },
	bold: { fontWeight: 'bold' },
	forms: {
		marginTop: 40,
		padding: '15px 0px',
	},
	bottomSpacing: {
		marginBottom: 20,
	},
	width: {
		maxWidth: 450,
	},
});

const Login = ({ userData, setUserData }) => {
	const { token } = userData;
	const isSmallScreen = useMediaQuery('(max-width: 599px)');
	const isMediumScreen = useMediaQuery('(max-width:959px)');
	const isLargeScreen = useMediaQuery('(min-width:1100px)');
	const classes = useStyles();

	if (token) return <Redirect to='/' />;

	return (
		<Grid
			container
			alignItems='center'
			spacing={isLargeScreen ? 3 : 0}
			className={classes.grid}
		>
			<Grid item xs={12} md={6}>
				<Container>
					<Grid container justify={isLargeScreen ? 'flex-end' : 'center'}>
						<div className={classes.width}>
							<Typography
								variant={isSmallScreen ? 'h4' : 'h2'}
								align={isMediumScreen ? 'center' : 'left'}
								color='primary'
								className={classes.bold}
							>
								fakebook
							</Typography>

							<Typography
								variant={isSmallScreen ? 'body1' : 'h5'}
								align={isMediumScreen ? 'center' : 'left'}
							>
								Connect with friends and the world around you on Fakebook.
							</Typography>
						</div>
					</Grid>
				</Container>
			</Grid>

			<Grid item xs={12} md={6}>
				<Grid container justify={isLargeScreen ? 'flex-start' : 'center'}>
					<Paper elevation={3} className={classes.forms}>
						<Container maxWidth='xs' className={classes.bottomSpacing}>
							<SignInForm setUserData={setUserData} />

							<Divider className={classes.bottomSpacing} />

							<ModalSignUpForm setUserData={setUserData} />

							<FacebookSignIn userData={userData} setUserData={setUserData} />

							<TestUserLogin setUserData={setUserData} />
						</Container>

						<Typography variant='body1' align='center'>
							Allow a few seconds for Heroku Dyno to start up for login
						</Typography>
					</Paper>
				</Grid>
			</Grid>
		</Grid>
	);
};

Login.propTypes = {
	userData: PropTypes.shape(userDataProp).isRequired,
	setUserData: PropTypes.shape(setUserDataProp).isRequired,
};

export default Login;
