import Post from '../models/Post';
import User from '../models/User';

import { AppError } from '../utils/errorHandler';

export const getPost = async(postId) => { // populate the comments to display the users
    const post = await Post.findById(postId)
                    .populate({
                        path: 'author',
                        select: 'username profilePicture',
                    })
                    .exec();
    if (post === null) throw new AppError(400,'Invalid :postId parameter');
    return post;
}

export const searchPosts = async(keyword, limit, page) => {
    const re = new RegExp(keyword, "i");
    const posts = await Post.find({ content: re }) 
                    .populate('author', 'username profilePicture')
                    .sort({ createdAt: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .exec();

    return posts;
}

export const getPosts = async (page, userId) => {
  let posts;
  if (userId) {
    const user = await User.findById(userId).exec();
    const friendsIds = user.friends;
    posts = await Post.find({ author: { $in: [...friendsIds, userId] } })
        .sort({ createdAt: -1 })
      .populate('author', 'username profilePicture')
      .skip((page - 1) * 15)
      .limit(15)
      .exec();
  } else {
    posts = await Post.find()
    .sort({ createdAt: -1 })
      .populate('author', 'username profilePicture')
      .skip((page - 1) * 15)
      .limit(15)
      .exec();
  }
  return posts;
};

export const createPost = async(postObj) => {
    const newPost = new Post({...postObj});
    
    const newPostRes = newPost.save()
        .then(savePostResult => {
            User.findByIdAndUpdate(postObj.author, { $push: { posts: savePostResult._id } })
                .then(addPostToUserResult => { return{savePostResult, addPostToUserResult} })
            return savePostResult;
        })

    return newPostRes;
}

export const updatePost = async(postId,newPostObj) => {
    const post = await Post.findById(postId).exec();
    if (post === null) throw new AppError(400, 'Invalid :postId parameter');

    const updatePost = await Post.updateOne({_id: postId}, {
        ...newPostObj
    });

    if(updatePost.modifiedCount === 1) {
        return 'Post modified successfully'
    } else {
        throw new AppError(500, "Post couldn't be modified");
    }
}

export const deletePost = async(userId, postId) => { // Does it remove the post from the user?
    const result = await Post.findByIdAndRemove(postId);
    const deleteFromUser = await User.findByIdAndUpdate(userId, { $pull : { post: postId }}).exec();
    return result;
}

export const likePost = async(userId, postId) => {
    const result = await Post.findByIdAndUpdate(postId, { $push: { likes: userId } }).exec();
    const resultUser = await Post.findByIdAndUpdate(userId, { $push: { likedPosts: postId }}).exec();
    return {result, resultUser};
}

export const unLikePost = async(userId, postId) => { // Does it remove the like from user?
    const result = await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
    const resultUser = await Post.findByIdAndUpdate(userId, { $pull: { likedPosts: postId }}).exec();
    return result;
}

// Continue testing the user posting , then test the redirectio when loggin in and the regestring is missing some fields