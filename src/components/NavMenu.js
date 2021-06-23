import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';

import AddCircleIcon from '@material-ui/icons/AddCircle';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import CloseIcon from '@material-ui/icons/Close';
import Brightness2Icon from '@material-ui/icons/Brightness2';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';

import PostForm from './forms/PostForm';

import { setUserDataProp, colourModeObjectProp } from '../util/customPropTypes';

const useStyles = makeStyles({
	sideSpacing: {
		marginRight: 10,
	},
	settings: {
		display: 'flex',
		alignItems: 'center',
	},
	modal: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: `translate(-50%, -50%)`,
	},
});

const NavMenu = ({ setUserData, colourModeObject, handleActiveTab }) => {
	const { setUser, setToken } = setUserData;
	const { colourMode, setColourMode } = colourModeObject;
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [menuAnchor, setMenuAnchor] = useState(null);
	const classes = useStyles();

	const handleModalOpen = () => {
		setIsModalOpen(true);
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
	};

	const handleMenuOpen = (e) => {
		setMenuAnchor(e.currentTarget);
	};

	const handleMenuClose = () => {
		setMenuAnchor(null);
	};

	const handleLogOut = () => {
		setUser({});
		setToken('');
		localStorage.clear();
	};

	const handleDarkModeToggle = () => {
		if (colourMode === 'dark') return setColourMode('light');

		return setColourMode('dark');
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
					<PostForm
						handleModalClose={handleModalClose}
						handleActiveTab={handleActiveTab}
					/>
				</CardContent>
			</Card>
		</Container>
	);

	return (
		<div>
			<IconButton onClick={handleMenuOpen}>
				<ArrowDropDownIcon />
			</IconButton>

			<Menu
				anchorEl={menuAnchor}
				open={Boolean(menuAnchor)}
				onClose={handleMenuClose}
			>
				<MenuItem
					onClick={() => {
						handleModalOpen();
						handleMenuClose();
					}}
				>
					<AddCircleIcon className={classes.sideSpacing} />
					Create Post
				</MenuItem>

				<MenuItem>
					<Link
						href='#/settings'
						underline='none'
						color='textPrimary'
						onClick={() => {
							handleActiveTab('');
							handleMenuClose();
						}}
						className={classes.settings}
					>
						<SettingsIcon className={classes.sideSpacing} />
						Settings
					</Link>
				</MenuItem>

				<MenuItem onClick={handleDarkModeToggle}>
					<Brightness2Icon className={classes.sideSpacing} />
					Dark Mode
				</MenuItem>

				<MenuItem onClick={handleLogOut}>
					<ExitToAppIcon className={classes.sideSpacing} />
					Logout
				</MenuItem>
			</Menu>

			<Modal open={isModalOpen} onClose={handleModalClose}>
				{modalBody}
			</Modal>
		</div>
	);
};

NavMenu.propTypes = {
	setUserData: PropTypes.shape(setUserDataProp).isRequired,
	colourModeObject: PropTypes.shape(colourModeObjectProp).isRequired,
	handleActiveTab: PropTypes.func.isRequired,
};

export default NavMenu;
