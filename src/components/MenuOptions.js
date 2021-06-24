import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import { useSnackbar } from 'notistack';

import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import MoreHorizOutlinedIcon from '@material-ui/icons/MoreHorizOutlined';
import { makeStyles } from '@material-ui/core/styles';

import PostForm from './forms/PostForm';
import CommentForm from './forms/CommentForm';

import { postRequests, commentRequests } from '../util/axiosRequests';
import { postProp, commentProp } from '../util/customPropTypes';

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
	deleteButton: {
		backgroundColor: '#d32f2f',
		color: '#fff',
		marginLeft: 'auto',
	},
});
const MenuOptions = ({ isPost, post, allPosts, setAllPosts, comment }) => {
	const [menuAnchor, setMenuAnchor] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isFormTypeEdit, setIsFormTypeEdit] = useState(true);
	const [deleteError, setDeleteError] = useState([]);
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();

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
				if (error.response) return setDeleteError(error.response.data.errors);

				return enqueueSnackbar(error.message, { variant: 'error' });
			}
		}

		try {
			const deleteResponse = await commentRequests.deleteComment(
				post._id,
				comment._id
			);
			const { comments } = deleteResponse.data.post;
			const newAllPosts = [...allPosts];
			const updatedPostIndex = newAllPosts.findIndex(
				(singlePost) => singlePost._id === post._id
			);

			if (updatedPostIndex === -1) return null;

			newAllPosts[updatedPostIndex].comments = comments;

			return setAllPosts(newAllPosts);
		} catch (error) {
			if (error.response) return setDeleteError(error.response.data.errors);

			return enqueueSnackbar(error.message, { variant: 'error' });
		}
	};

	const phrasing = isPost ? 'Post' : 'Comment';
	const editForm = isPost ? (
		<PostForm
			post={post}
			handleModalClose={handleModalClose}
			allPosts={allPosts}
			setAllPosts={setAllPosts}
			isEdit
		/>
	) : (
		<CommentForm
			post={post}
			allPosts={allPosts}
			setAllPosts={setAllPosts}
			comment={comment}
			isEdit
		/>
	);

	const modalBody = (
		<Container maxWidth='sm' className={classes.modal}>
			<Card>
				{isFormTypeEdit ? (
					<CardHeader
						title={`Edit ${phrasing}`}
						subheader={isPost ? 'Max image size of 1.5 MB' : null}
						action={
							<IconButton onClick={handleModalClose}>
								<CloseIcon />
							</IconButton>
						}
					/>
				) : (
					<CardHeader
						title={`Delete ${phrasing}`}
						subheader={`Are you sure you want to delete this ${phrasing}?`}
						action={
							<IconButton onClick={handleModalClose}>
								<CloseIcon />
							</IconButton>
						}
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
					<CardActions>
						<Button
							variant='contained'
							startIcon={<DeleteForeverIcon />}
							onClick={handleDeleteClick}
							className={classes.deleteButton}
						>
							Delete
						</Button>
					</CardActions>
				)}
			</Card>
		</Container>
	);

	return (
		<div>
			<IconButton onClick={handleMenuOpen}>
				<MoreHorizOutlinedIcon />
			</IconButton>

			<Menu
				anchorEl={menuAnchor}
				open={Boolean(menuAnchor)}
				onClose={handleMenuClose}
			>
				<MenuItem onClick={() => handleModalOpen(true)}>
					<EditIcon className={classes.sideSpacing} />
					Edit {phrasing}
				</MenuItem>

				<MenuItem onClick={() => handleModalOpen(false)}>
					<DeleteIcon className={classes.sideSpacing} />
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
	isPost: PropTypes.bool,
	post: PropTypes.shape(postProp).isRequired,
	allPosts: PropTypes.arrayOf(PropTypes.shape(postProp)).isRequired,
	setAllPosts: PropTypes.func.isRequired,
	comment: PropTypes.shape(commentProp),
};

MenuOptions.defaultProps = {
	isPost: false,
	comment: null,
};

export default MenuOptions;
