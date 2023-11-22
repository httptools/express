const User = require("../modules/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/**
 * Register API (for users)
 * @param {name, email, phone, password, employees, business, business_subject, target, page, biography} req
 * @param {status, message, token} res
 * @returns
 */
exports.createUser = async (req, res) => {
  try {
    if (
      !req.body ||
      !req.body.name ||
      !req.body.email ||
      !req.body.password ||
      !req.body.phone ||
      !req.body.employees ||
      !req.body.business ||
      !req.body.business_subject ||
      !req.body.target ||
      !req.body.page ||
      !req.body.biography
    ) {
      res.status(400).json({
        status: false,
        message: "please enter all data",
      });
      return;
    }

    if (typeof req.body.password !== "string") {
      return res
        .status(400)
        .json({ status: false, message: "Password must be a string" });
    }

    if (typeof req.body.email !== "string") {
      return res
        .status(400)
        .json({ status: false, message: "Email must be a string" });
    }

    if (typeof req.body.name !== "string") {
      return res
        .status(400)
        .json({ status: false, message: "Name must be a string" });
    }

    if (typeof req.body.phone !== "string") {
      return res
        .status(400)
        .json({ status: false, message: "Phone must be a string" });
    }

    if (typeof req.body.employees !== "string") {
      return res
        .status(400)
        .json({ status: false, message: "Employees must be a string" });
    }

    if (typeof req.body.business !== "string") {
      return res
        .status(400)
        .json({ status: false, message: "Business must be a string" });
    }

    if (typeof req.body.business_subject !== "string") {
      return res
        .status(400)
        .json({ status: false, message: "Business Subject must be a string" });
    }

    if (typeof req.body.target !== "string") {
      return res
        .status(400)
        .json({ status: false, message: "Target must be a string" });
    }

    if (typeof req.body.page !== "string") {
      return res
        .status(400)
        .json({ status: false, message: "Page must be a string" });
    }

    if (typeof req.body.biography !== "string") {
      return res
        .status(400)
        .json({ status: false, message: "Biography must be a string" });
    }

    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(req.body.email)) {
      return res.status(400).json({ status: false, message: "Invalid email" });
    }

    const existingUser = await User.findOne({
      $or: [{ email: req.body.email }, { phone: req.body.phone }],
    });

    if (existingUser) {
      res.status(400).json({
        status: false,
        message: "User already exists with the given email or phone number",
      });
      return;
    }

    const password = await bcrypt.hash(req.body.password, 10);

    const token = jwt.sign({ email: req.body.email }, process.env.APP_KEY, {
      expiresIn: "100y",
      algorithm: "HS256",
    });

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: password,
      phone: req.body.phone,
      token: token,
      role: 0,
      active: 1,
      employees: req.body.employees,
      business: req.body.business,
      business_subject: req.body.business_subject,
      target: req.body.target,
      page: req.body.page,
      biography: req.body.biography,
    });

    res.status(200).json({
      status: true,
      message: "user created successfully",
      token: token,
      id: user._id,
      active: 1,
      role: user.role,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      error: error.message,
    });
    return;
  }
};

/**
 * Login API (for users)
 * @param {email, password} req
 * @param {status, message, token} res
 * @returns
 */
exports.Login = async (req, res) => {
  try {
    if (!req.body || !req.body.email || !req.body.password) {
      res.status(400).json({
        status: false,
        message: "please enter all data",
      });
      return;
    }

    if (typeof req.body.password !== "string") {
      return res
        .status(400)
        .json({ status: false, message: "Password must be a string" });
    }

    if (typeof req.body.email !== "string") {
      return res
        .status(400)
        .json({ status: false, message: "Email must be a string" });
    }

    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "Incorrect email or password" });
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      res.status(400).json({
        status: false,
        message: "Incorrect email or password",
      });
      return;
    }

    const token = jwt.sign({ email: req.body.email }, process.env.APP_KEY, {
      expiresIn: "100y",
      algorithm: "HS256",
    });

    await User.updateOne({ email: req.body.email }, { token: token });

    res.status(200).json({
      status: true,
      message: "user logged in successfully",
      token: token,
      id: user._id,
      active: user.active,
      role: user.role,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      error: error.message,
    });
    return;
  }
};

/**
 * Get All Users API (for users)
 * @param {} req
 * @param {status, result} res
 * @returns
 */
exports.getAllUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    const totalCount = await User.countDocuments();
    const pagesCount = Math.ceil(totalCount / limit);

    const data = await User.find()
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    if (data.length === 0) {
      return res.status(200).json({
        status: false,
        page: page,
        pagesCount,
        result: [],
      });
    }

    const result = data.map((user) => {
      const { password, token, phone, ...result } = user.toObject();
      return result;
    });

    res.status(200).json({
      status: true,
      page: page,
      pagesCount,
      result,
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      error: "Error in getting data",
    });
  }
};

/**
 * Get User API (for users)
 * @param {/id} req
 * @param {status, data} res
 * @returns
 */
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    const { password, token, phone, ...data } = user.toObject();

    res.status(200).json({
      status: true,
      data,
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      error: "User not found",
    });
  }
};

/**
 * Update User API (for users)
 * @param {/id, Authorization, data} req
 * @param {status, data} res
 * @returns
 */
exports.updateUser = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).json({
        status: false,
        message: "please enter all data",
      });
      return;
    }

    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res
        .status(403)
        .json({ status: false, message: "Invalid token or id" });
    }
    const userToken = authHeader && authHeader.split(" ")[1];
    if (!userToken) {
      return res
        .status(403)
        .json({ status: false, message: "Invalid token or id" });
    }

    const id = await User.findById(req.params.id);

    if (!id) {
      return res.status(400).json({
        status: false,
        error: "User not found",
      });
    }

    const userID = id._id;

    if (req.body.email) {
      if (
        !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(req.body.email)
      ) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid email format" });
      }

      const findUser = await User.findOne({ email: req.body.email });

      if (
        findUser &&
        findUser._id &&
        findUser._id.toString() !== userID.toString()
      ) {
        return res.status(403).json({
          status: false,
          message: "Cannot update with a different email",
        });
      }
    }

    if (req.body.phone) {
      const findUser = await User.findOne({ phone: req.body.phone });

      if (
        findUser &&
        findUser._id &&
        findUser._id.toString() !== userID.toString()
      ) {
        return res.status(403).json({
          status: false,
          message: "Cannot update with a different phone",
        });
      }
    }

    if (req.body.role !== undefined) {
      return res.status(403).json({
        status: false,
        message: "Cannot update role by user",
      });
    }

    if (req.body.active !== undefined) {
      return res.status(403).json({
        status: false,
        message: "Cannot update active by user",
      });
    }

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    jwt.verify(userToken, process.env.APP_KEY, (err) => {
      if (err) {
        return res
          .status(403)
          .json({ status: false, message: "Invalid token or id" });
      }
    });

    const user = await User.findOneAndUpdate(
      { token: userToken, _id: userID },
      req.body,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res
        .status(403)
        .json({ status: false, message: "Invalid token or id" });
    }

    const NewUserData = await User.findById(user._id);

    const { password, ...data } = NewUserData.toObject();

    res.status(200).json({
      status: true,
      data,
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      error: "User not found",
    });
  }
};

/**
 * Delete User API (for users)
 * @param {/id, Authorization, data} req
 * @param {status, message} res
 * @returns
 */
exports.deleteUser = async (req, res) => {
  try {
    if (!req.body || !req.body.password) {
      res.status(400).json({
        status: false,
        message: "please enter all data",
      });
      return;
    }

    if (typeof req.body.password !== "string") {
      return res
        .status(400)
        .json({ status: false, message: "Password must be a string" });
    }

    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res
        .status(403)
        .json({ status: false, message: "Invalid token or password" });
    }
    const userToken = authHeader && authHeader.split(" ")[1];
    if (!userToken) {
      return res
        .status(403)
        .json({ status: false, message: "Invalid token or password" });
    }

    const id = await User.findById(req.params.id);

    if (!id) {
      return res.status(400).json({
        status: false,
        error: "User not found",
      });
    }

    const userID = id._id;

    jwt.verify(userToken, process.env.APP_KEY, (err) => {
      if (err) {
        return res
          .status(403)
          .json({ status: false, message: "Invalid token or password" });
      }
    });

    const getData = await User.findOne({ token: userToken, _id: userID });

    if (!getData) {
      return res
        .status(403)
        .json({ status: false, message: "Invalid token or password" });
    }

    const match = await bcrypt.compare(req.body.password, getData.password);

    if (!match) {
      res.status(400).json({
        status: false,
        message: "Incorrect token or password",
      });
      return;
    }

    const user = await User.deleteOne(
      { token: userToken, _id: userID },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res
        .status(403)
        .json({ status: false, message: "Invalid token or password" });
    }

    res.status(200).json({
      status: true,
      message: "user deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      error: "User not found",
    });
  }
};