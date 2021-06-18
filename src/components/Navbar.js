import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Modal from '@material-ui/core/Modal';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import AddCircleIcon from '@material-ui/icons/AddCircle';
import CloseIcon from '@material-ui/icons/Close';
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import NavMenu from './NavMenu';
import PostForm from './forms/PostForm';

import { userDataProp, setUserDataProp } from '../util/customPropTypes';
import useStyles from '../util/useStylesHook';

const Navbar = ({ children, userData, setUserData }) => {
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
						<Link to='/'>
							<IconButton>
								<HomeIcon />
							</IconButton>
						</Link>
					</Tooltip>

					<Tooltip title={<Typography variant='body2'>Friends</Typography>}>
						<Link to='/friends'>
							<IconButton>
								<PeopleIcon />
							</IconButton>
						</Link>
					</Tooltip>

					<Tooltip title={<Typography variant='body2'>All Users</Typography>}>
						<Link to='/users'>
							<IconButton>
								<PersonAddIcon />
							</IconButton>
						</Link>
					</Tooltip>

					<Tooltip title={<Typography variant='body2'>Create Post</Typography>}>
						<IconButton onClick={handleModalOpen}>
							<AddCircleIcon />
						</IconButton>
					</Tooltip>

					<NavMenu userData={userData} setUserData={setUserData} />
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
};

export default Navbar;
