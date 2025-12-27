import { asyncHandler } from "../utils/async_handler.js";
import { APIError } from "../utils/api_error.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { APIResponse } from "../utils/api_response.js";

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    const { username, email, fullname, password } = req.body;
    console.log("email:", email);
    // validation - not empty
    if([username, email, fullname, password].some((field) => field?.trim() === "")) {
        throw new APIError("All fields are required", 400);
    }
    // check if user already exists
    const userExists = await User.findOne({$or: [{username: username?.trim()}, {email: email?.trim()}]})
    if(userExists) {
        throw new APIError("User already exists", 400);
    }
    // check for images, check kor avatar
    const avatarLocalFilePath = req.files?.avatar?.[0]?.path;
    const coverImageLocalFilePath = req.files?.coverImage?.[0]?.path;
    if(!avatarLocalFilePath) {
        throw new APIError("Avatar is required", 400);
    }
    // upload them to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalFilePath);
    const coverImage = await uploadOnCloudinary(coverImageLocalFilePath);
    if(!avatar) {
        throw new APIError("Avatar or cover image upload failed", 400);
    }
    // create user object - create entry in database
    const user = await User.create({
        username: username.toLowerCase(),
        email: email,
        fullname: fullname,
        password: password,
        avatar: avatar?.url,
        coverImage: coverImage?.url || "",
    });
    // remove password & refresh token from response
    const createdUser = User.findById(user._id).select("-password -refreshToken");
    //check for user creation
    if(!createdUser) {
        throw new APIError("User creation failed", 400);
    }
    // return response
    return res.status(201).json(
        APIResponse(createdUser, "User created successfully")
    );
});

export { registerUser };

