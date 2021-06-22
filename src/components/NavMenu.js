import React, { useState } from 'react';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Brightness2Icon from '@material-ui/icons/Brightness2';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';

import { setUserDataProp } from '../util/customPropTypes';
import useStyles from '../util/useStylesHook';

const NavMenu = ({ setUserData, darkMode }) => {
	const { isDarkMode, setIsDarkMode } = darkMode;
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
		localStorage.clear();
	};

	const handleDarkModeToggle = () => {
		if (isDarkMode === 'false') return setIsDarkMode('true');

		return setIsDarkMode('false');
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
				{/* TODO style flex align center remove underline */}
				<MenuItem>
					<Link href='#/settings'>
						<Typography color='textPrimary'>
							<SettingsIcon
								className={classes.sideSpacing}
								setUserData={setUserData}
							/>
							Settings
						</Typography>
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
		</div>
	);
};

NavMenu.propTypes = {
	setUserData: PropTypes.shape(setUserDataProp).isRequired,
	darkMode: PropTypes.shape({
		isDarkMode: PropTypes.string,
		setIsDarkMode: PropTypes.func,
	}).isRequired,
};

export default NavMenu;
