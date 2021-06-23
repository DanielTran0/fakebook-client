import React, { useState } from 'react';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';

import ChatIcon from '@material-ui/icons/Chat';
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import NavMenu from './NavMenu';

import setUserImageSource from '../util/setUserImageSource';
import {
	userDataProp,
	setUserDataProp,
	colourModeObjectProp,
} from '../util/customPropTypes';

const useStyles = makeStyles({
	bottomSpacing: {
		marginBottom: 10,
	},
	center: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	avatar: {
		width: 30,
		height: 30,
	},
	capitalize: {
		textTransform: 'capitalize',
	},
});

const Navbar = ({ children, userData, setUserData, colourModeObject }) => {
	const { colourMode } = colourModeObject;
	const { firstName, lastName } = userData.user;
	const [activeTab, setActiveTab] = useState('home');
	const isSmallScreen = useMediaQuery('(max-width: 599px)');
	const classes = useStyles();

	const handleActiveTab = (tabName) => {
		setActiveTab(tabName);
	};

	return (
		<div>
			<AppBar
				position={isSmallScreen ? 'static' : 'sticky'}
				color={colourMode === 'dark' ? 'default' : 'inherit'}
				elevation={0}
				className={classes.bottomSpacing}
			>
				<Toolbar className={classes.center}>
					<Tooltip title={<Typography variant='body2'>Home</Typography>}>
						<Link href='#/'>
							<IconButton
								color={activeTab === 'home' ? 'primary' : 'default'}
								onClick={() => {
									handleActiveTab('home');
								}}
							>
								<HomeIcon />
							</IconButton>
						</Link>
					</Tooltip>

					<Tooltip title={<Typography variant='body2'>Friends</Typography>}>
						<Link href='#/friends'>
							<IconButton
								color={activeTab === 'friends' ? 'primary' : 'default'}
								onClick={() => {
									handleActiveTab('friends');
								}}
							>
								<PeopleIcon />
							</IconButton>
						</Link>
					</Tooltip>

					<Tooltip title={<Typography variant='body2'>All Users</Typography>}>
						<Link href='#/users'>
							<IconButton
								color={activeTab === 'users' ? 'primary' : 'default'}
								onClick={() => {
									handleActiveTab('users');
								}}
							>
								<PersonAddIcon />
							</IconButton>
						</Link>
					</Tooltip>

					<Tooltip title={<Typography variant='body2'>Chat</Typography>}>
						<Link href='#/chat'>
							<IconButton
								color={activeTab === 'chat' ? 'primary' : 'default'}
								onClick={() => {
									handleActiveTab('chat');
								}}
							>
								<ChatIcon />
							</IconButton>
						</Link>
					</Tooltip>

					<Tooltip
						title={<Typography variant='body2'>Profile Page</Typography>}
						onClick={() => {
							handleActiveTab('');
						}}
					>
						<Link
							href={`#/user/${userData.user._id}`}
							underline='none'
							className={classes.center}
						>
							<IconButton>
								<Avatar
									src={setUserImageSource(userData.user)}
									className={classes.avatar}
								/>
							</IconButton>

							{!isSmallScreen && (
								<Typography color='textPrimary' className={classes.capitalize}>
									{firstName} {lastName}
								</Typography>
							)}
						</Link>
					</Tooltip>

					<NavMenu
						userData={userData}
						setUserData={setUserData}
						colourModeObject={colourModeObject}
						handleActiveTab={handleActiveTab}
					/>
				</Toolbar>
			</AppBar>

			<div>{children}</div>
		</div>
	);
};

Navbar.propTypes = {
	children: PropTypes.element.isRequired,
	userData: PropTypes.shape(userDataProp).isRequired,
	setUserData: PropTypes.shape(setUserDataProp).isRequired,
	colourModeObject: PropTypes.shape(colourModeObjectProp).isRequired,
};

export default Navbar;
