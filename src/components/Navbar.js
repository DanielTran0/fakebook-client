import React, { useState } from 'react';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import AddCircleIcon from '@material-ui/icons/AddCircle';
import ChatIcon from '@material-ui/icons/Chat';
import CloseIcon from '@material-ui/icons/Close';
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import NavMenu from './NavMenu';
import PostForm from './forms/PostForm';

import setUserImageSource from '../util/setUserImageSource';
import { userDataProp, setUserDataProp } from '../util/customPropTypes';
import useStyles from '../util/useStylesHook';

const Navbar = ({ children, userData, setUserData, darkMode }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const isMobile = useMediaQuery('(max-width: 425px)');
	const classes = useStyles();

	const handleModalOpen = () => {
		setIsModalOpen(true);
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
	};

	const modalBody = (
		<Container maxWidth='sm' className={classes.modal}>
			<Card>
				<CardHeader
					title='Create Post'
					subheader='Max image size of 1.5 MB'
					action={
						<IconButton onClick={handleModalClose}>
							<CloseIcon />
						</IconButton>
					}
				/>

				<Divider />

				<CardContent>
					<PostForm handleModalClose={handleModalClose} />
				</CardContent>
			</Card>
		</Container>
	);

	return (
		<div>
			<AppBar
				className={classes.bottomSpacing}
				position={isMobile ? 'static' : 'sticky'}
				color='default'
				elevation={0}
			>
				<Toolbar>
					<Tooltip title={<Typography variant='body2'>Home</Typography>}>
						<Link href='/'>
							<IconButton>
								<HomeIcon />
							</IconButton>
						</Link>
					</Tooltip>

					<Tooltip title={<Typography variant='body2'>Friends</Typography>}>
						<Link href='#/friends'>
							<IconButton>
								<PeopleIcon />
							</IconButton>
						</Link>
					</Tooltip>

					<Tooltip title={<Typography variant='body2'>All Users</Typography>}>
						<Link href='#/users'>
							<IconButton>
								<PersonAddIcon />
							</IconButton>
						</Link>
					</Tooltip>

					<Tooltip title={<Typography variant='body2'>Chat</Typography>}>
						<Link href='#/chat'>
							<IconButton>
								<ChatIcon />
							</IconButton>
						</Link>
					</Tooltip>

					<Tooltip
						title={<Typography variant='body2'>Profile Page</Typography>}
					>
						<Link href={`#/user/${userData.user._id}`}>
							<Paper className={classes.userCardSpacing}>
								<IconButton>
									<Avatar
										className={classes.avatarNav}
										src={setUserImageSource(userData.user)}
									/>
								</IconButton>
								{!isMobile && (
									<Typography className={classes.capitalize}>
										{userData.user.firstName} {userData.user.lastName}
									</Typography>
								)}
							</Paper>
						</Link>
					</Tooltip>

					<Tooltip title={<Typography variant='body2'>Create Post</Typography>}>
						<IconButton onClick={handleModalOpen}>
							<AddCircleIcon />
						</IconButton>
					</Tooltip>

					<NavMenu
						userData={userData}
						setUserData={setUserData}
						darkMode={darkMode}
					/>
				</Toolbar>
			</AppBar>

			<Modal open={isModalOpen} onClose={handleModalClose}>
				{modalBody}
			</Modal>

			<div>{children}</div>
		</div>
	);
};

Navbar.propTypes = {
	children: PropTypes.element.isRequired,
	userData: PropTypes.shape(userDataProp).isRequired,
	setUserData: PropTypes.shape(setUserDataProp).isRequired,
	darkMode: PropTypes.shape({
		isDarkMode: PropTypes.string,
		setIsDarkMode: PropTypes.func,
	}).isRequired,
};

export default Navbar;
