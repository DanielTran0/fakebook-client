import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabPanel from '@material-ui/lab/TabPanel';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import DisplayOptions from '../components/DisplayOptions';
import UserUpdateForm from '../components/forms/UserUpdateForm';

import { setUserDataProp } from '../util/customPropTypes';

const Settings = ({ setUserData }) => {
	const [tabValue, setTabValue] = useState('0');
	const isMobile = useMediaQuery('(max-width: 425px)');

	const handleTabChange = (e, newTabValue) => {
		setTabValue(newTabValue);
	};

	return (
		<Container maxWidth='sm'>
			<Typography variant={isMobile ? 'h5' : 'h4'} align='center'>
				Settings
			</Typography>

			<Paper>
				<TabContext value={tabValue}>
					<Tabs value={tabValue} onChange={handleTabChange} centered>
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
};

export default Settings;
