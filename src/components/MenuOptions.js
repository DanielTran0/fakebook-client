import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';

import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import MoreHorizOutlinedIcon from '@material-ui/icons/MoreHorizOutlined';

import PostForm from './forms/PostForm';

import { postRequests } from '../util/axiosRequests';
import { postProp } from '../util/customPropTypes';
import useStyles from '../util/useStylesHook';

const MenuOptions = ({ isPost, post, allPosts, setAllPosts }) => {
	const [menuAnchor, setMenuAnchor] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isFormTypeEdit, setIsFormTypeEdit] = useState(true);
	const [deleteError, setDeleteError] = useState([]);
	const classes = useStyles();

	console.log(deleteError);

	const handleMenuOpen = (e) => {
		setMenuAnchor(e.currentTarget);
	};

	const handleMenuClose = () => {
		setMenuAnchor(null);
	};

	const handleModalOpen = (isEdit) => {
		handleMenuClose();
		setIsFormTypeEdit(isEdit);
		setDeleteError([]);
		setIsModalOpen(true);
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
	};

	const handleDeleteClick = async () => {
		if (isPost) {
			try {
				await postRequests.deletePost(post._id);
				const newAllPosts = [...allPosts];
				const deletePostIndex = newAllPosts.findIndex(
					(singlePost) => singlePost._id === post._id
				);

				if (deletePostIndex === -1) return null;

				newAllPosts.splice(deletePostIndex, 1);
				return setAllPosts(newAllPosts);
			} catch (error) {
				return setDeleteError(error.response.data.errors);
			}
		}

		// TODO comment delete

		return null;
	};

	const phrasing = isPost ? 'Post' : 'Comment';
	const editForm = isPost ? (
		<PostForm
			post={post}
			handleModalClose={handleModalClose}
			allPosts={allPosts}
			setAllPosts={setAllPosts}
		/>
	) : null;

	const modalBody = (
		<Container maxWidth='sm' className={classes.modal}>
			<Card>
				{isFormTypeEdit ? (
					<CardHeader
						title={`Edit ${phrasing}`}
						subheader={isPost ? 'Max image size of 1.5 MB' : null}
					/>
				) : (
					<CardHeader
						title={`Delete ${phrasing}`}
						subheader={`Are you sure you want to delete this ${phrasing}?`}
					/>
				)}
				<Divider />

				{deleteError[0] && (
					<Container className={classes.bottomSpacing}>
						<Typography color='secondary'>{deleteError[0].msg}</Typography>
					</Container>
				)}
				{isFormTypeEdit ? (
					<CardContent>{editForm}</CardContent>
				) : (
					<CardActions className={classes.buttonSpaceEnd}>
						<Button variant='contained' onClick={handleModalClose}>
							Cancel
						</Button>
						<Button
							variant='contained'
							startIcon={<DeleteOutlineOutlinedIcon />}
							onClick={handleDeleteClick}
						>
							Delete
						</Button>
					</CardActions>
				)}
			</Card>
		</Container>
	);

	return (
		<div className='menu-options'>
			<IconButton onClick={handleMenuOpen}>
				<MoreHorizOutlinedIcon />
			</IconButton>
			<Menu
				anchorEl={menuAnchor}
				open={Boolean(menuAnchor)}
				onClose={handleMenuClose}
			>
				<MenuItem onClick={() => handleModalOpen(true)}>
					Edit {phrasing}
				</MenuItem>
				<MenuItem onClick={() => handleModalOpen(false)}>
					Delete {phrasing}
				</MenuItem>
			</Menu>
			<Modal open={isModalOpen} onClose={handleModalClose}>
				{modalBody}
			</Modal>
		</div>
	);
};

MenuOptions.propTypes = {
	isPost: PropTypes.bool.isRequired,
	post: PropTypes.shape(postProp).isRequired,
	allPosts: PropTypes.arrayOf(PropTypes.shape(postProp)).isRequired,
	setAllPosts: PropTypes.func.isRequired,
};

export default MenuOptions;
