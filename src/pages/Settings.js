import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabPanel from '@material-ui/lab/TabPanel';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';

import DisplayOptions from '../components/DisplayOptions';
import UserUpdateForm from '../components/forms/UserUpdateForm';

import { setUserDataProp } from '../util/customPropTypes';

const useStyles = makeStyles({
	bottomSpacing: {
		marginBottom: 10,
	},
});

const Settings = ({ setUserData, setActiveTab }) => {
	const [tabValue, setTabValue] = useState('0');
	const isSmallScreen = useMediaQuery('(max-width: 599px)');
	const classes = useStyles();

	useEffect(() => {
		setActiveTab('');
	}, [setActiveTab]);

	const handleTabChange = (e, newTabValue) => {
		setTabValue(newTabValue);
	};

	return (
		<Container maxWidth='sm'>
			<Typography
				variant={isSmallScreen ? 'h5' : 'h4'}
				align='center'
				className={classes.bottomSpacing}
			>
				Settings
			</Typography>

			<Paper>
				<TabContext value={tabValue}>
					<Tabs
						value={tabValue}
						onChange={handleTabChange}
						indicatorColor='primary'
						centered
					>
						<Tab label='Display' value='0' />
						<Tab label='Account' value='1' />
					</Tabs>

					<TabPanel value='0'>
						<DisplayOptions />
					</TabPanel>

					<TabPanel value='1'>
						<UserUpdateForm setUserData={setUserData} />
					</TabPanel>
				</TabContext>
			</Paper>
		</Container>
	);
};

Settings.propTypes = {
	setUserData: PropTypes.shape(setUserDataProp).isRequired,
	setActiveTab: PropTypes.func.isRequired,
};

export default Settings;
