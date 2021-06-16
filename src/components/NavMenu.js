import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Brightness2Icon from '@material-ui/icons/Brightness2';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';

import { userDataProp, setUserDataProp } from '../util/customPropTypes';
import useStyles from '../util/useStylesHook';

const NavMenu = ({ userData, setUserData }) => {
	const { setUser, setToken } = setUserData;
	const [menuAnchor, setMenuAnchor] = useState(null);
	const classes = useStyles();

	const handleMenuOpen = (e) => {
		setMenuAnchor(e.currentTarget);
	};

	const handleMenuClose = () => {
		setMenuAnchor(null);
	};

	const handleLogOut = () => {
		setUser({});
		setToken('');
	};

	return (
		<div className='nav-menu'>
			<IconButton onClick={handleMenuOpen}>
				<ArrowDropDownIcon />
			</IconButton>

			<Menu
				anchorEl={menuAnchor}
				open={Boolean(menuAnchor)}
				onClose={handleMenuClose}
			>
				<MenuItem>
					<Link to='/settings'>
						<SettingsIcon className={classes.sideSpacing} />
						Settings
					</Link>
				</MenuItem>

				<MenuItem>
					<Brightness2Icon className={classes.sideSpacing} />
					Dark Mode
				</MenuItem>

				<MenuItem onClick={handleLogOut}>
					<ExitToAppIcon className={classes.sideSpacing} />
					Logout
				</MenuItem>
			</Menu>
		</div>
	);
};

NavMenu.propTypes = {
	userData: PropTypes.shape(userDataProp).isRequired,
	setUserData: PropTypes.shape(setUserDataProp).isRequired,
};

export default NavMenu;