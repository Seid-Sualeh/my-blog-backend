const Writer = require("../writer/writer.model");
const jwt = require("jsonwebtoken");
const config = require("../../config");

class AuthService {
  // Generate JWT token
  generateToken(writerId) {
    return jwt.sign(
      { writerId },
      config.jwtSecret,
      { 
        expiresIn: "7d", // 7 days
        issuer: "blog-api",
        audience: "blog-users"
      }
    );
  }

  // Sign up new writer
  async signUp(signUpData) {
    try {
      const { name, email, password } = signUpData;

      // Check if writer already exists
      const existingWriter = await Writer.findOne({ email });
      if (existingWriter) {
        throw new Error("Writer with this email already exists");
      }

      // Create new writer
      const writer = new Writer({
        name,
        email,
        password,
      });

      const savedWriter = await writer.save();

      // Generate JWT token
      const token = this.generateToken(savedWriter._id);

      // Return writer data without password
      const writerResponse = {
        _id: savedWriter._id,
        name: savedWriter.name,
        email: savedWriter.email,
        bio: savedWriter.bio,
        profileImage: savedWriter.profileImage,
        socialLinks: savedWriter.socialLinks,
        isActive: savedWriter.isActive,
        createdAt: savedWriter.createdAt,
        updatedAt: savedWriter.updatedAt,
      };

      return {
        writer: writerResponse,
        token,
        writerId: savedWriter._id,
      };
    } catch (error) {
      throw new Error(`Error during signup: ${error.message}`);
    }
  }

  // Login writer
  async login(loginData) {
    try {
      const { email, password } = loginData;

      // Find writer by email and include password
      const writer = await Writer.findOne({ email }).select("+password");

      if (!writer) {
        throw new Error("Invalid email or password");
      }

      // Check if writer is active
      if (!writer.isActive) {
        throw new Error("Account is deactivated");
      }

      // Compare password
      const isPasswordValid = await writer.comparePassword(password);

      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      }

      // Generate JWT token
      const token = this.generateToken(writer._id);

      // Return writer data without password
      const writerResponse = {
        _id: writer._id,
        name: writer.name,
        email: writer.email,
        bio: writer.bio,
        profileImage: writer.profileImage,
        socialLinks: writer.socialLinks,
        isActive: writer.isActive,
        createdAt: writer.createdAt,
        updatedAt: writer.updatedAt,
      };

      return {
        writer: writerResponse,
        token,
        writerId: writer._id,
        email: writer.email,
      };
    } catch (error) {
      throw new Error(`Error during login: ${error.message}`);
    }
  }

  // Get writer by ID (for session management)
  async getWriterById(writerId) {
    try {
      const writer = await Writer.findById(writerId);

      if (!writer) {
        throw new Error("Writer not found");
      }

      return {
        _id: writer._id,
        name: writer.name,
        email: writer.email,
        bio: writer.bio,
        profileImage: writer.profileImage,
        socialLinks: writer.socialLinks,
        isActive: writer.isActive,
        createdAt: writer.createdAt,
        updatedAt: writer.updatedAt,
      };
    } catch (error) {
      throw new Error(`Error fetching writer: ${error.message}`);
    }
  }

  // Refresh token
  async refreshToken(writerId) {
    try {
      const writer = await Writer.findById(writerId);
      
      if (!writer || !writer.isActive) {
        throw new Error("Invalid or inactive writer");
      }

      const newToken = this.generateToken(writer._id);
      
      return {
        token: newToken,
        writer: {
          _id: writer._id,
          name: writer.name,
          email: writer.email,
          bio: writer.bio,
          profileImage: writer.profileImage,
          socialLinks: writer.socialLinks,
          isActive: writer.isActive,
          createdAt: writer.createdAt,
          updatedAt: writer.updatedAt,
        }
      };
    } catch (error) {
      throw new Error(`Error refreshing token: ${error.message}`);
    }
  }
}

module.exports = new AuthService();