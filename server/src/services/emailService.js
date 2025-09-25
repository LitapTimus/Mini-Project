const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        ciphers: "SSLv3",
      },
    });

    // Verify connection configuration
    this.verifyConnection();
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log("✅ Email service connected successfully");
    } catch (error) {
      console.error("❌ Email service connection failed:", error.message);
    }
  }

  // Send OTP email for verification
  async sendVerificationOTP(email, otp, name = "User") {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: "🔐 Verify Your CareerCompass Account",
      html: this.getVerificationEmailTemplate(name, otp),
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Verification email sent to ${email}`);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error(
        `❌ Failed to send verification email to ${email}:`,
        error.message
      );
      return { success: false, error: error.message };
    }
  }

  // Send password reset OTP
  async sendPasswordResetOTP(email, otp, name = "User") {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: "🔑 Reset Your CareerCompass Password",
      html: this.getPasswordResetEmailTemplate(name, otp),
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Password reset email sent to ${email}`);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error(
        `❌ Failed to send password reset email to ${email}:`,
        error.message
      );
      return { success: false, error: error.message };
    }
  }

  // Send welcome email after successful verification
  async sendWelcomeEmail(email, name, role) {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: "🎉 Welcome to CareerCompass!",
      html: this.getWelcomeEmailTemplate(name, role),
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Welcome email sent to ${email}`);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error(
        `❌ Failed to send welcome email to ${email}:`,
        error.message
      );
      return { success: false, error: error.message };
    }
  }

  // Email templates
  getVerificationEmailTemplate(name, otp) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Account</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #10b981, #3b82f6); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
              🚀 CareerCompass
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
              Your career journey starts here
            </p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">
              Hi ${name}! 👋
            </h2>
            
            <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
              Thanks for signing up with CareerCompass! To complete your registration and start your career journey, please verify your email address using the OTP below:
            </p>
            
            <!-- OTP Box -->
            <div style="background: linear-gradient(135deg, #f0fdf4, #ecfdf5); border: 2px solid #10b981; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
              <p style="color: #333; font-size: 16px; margin: 0 0 15px 0;">
                Your verification code is:
              </p>
              <div style="font-size: 36px; font-weight: bold; color: #10b981; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                ${otp}
              </div>
            </div>
            
            <p style="color: #666; font-size: 14px; margin: 30px 0;">
              ⏰ This code will expire in <strong>10 minutes</strong> for security reasons.
            </p>
            
            <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 30px 0;">
              <p style="color: #475569; font-size: 14px; margin: 0; line-height: 1.5;">
                <strong>🔒 Security Tip:</strong> Never share this code with anyone. CareerCompass will never ask for your verification code via phone or email.
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              If you didn't create an account with CareerCompass, please ignore this email.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px; margin: 0;">
              © ${new Date().getFullYear()} CareerCompass. Made with ❤️ for your career success.
            </p>
            <p style="color: #94a3b8; font-size: 12px; margin: 10px 0 0 0;">
              This email was sent to ${name}. If you have questions, contact us at support@careercompass.com
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getPasswordResetEmailTemplate(name, otp) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #ef4444, #f97316); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
              🔑 Password Reset
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
              CareerCompass Account Security
            </p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">
              Hi ${name}! 👋
            </h2>
            
            <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
              We received a request to reset your CareerCompass account password. Use the verification code below to proceed:
            </p>
            
            <!-- OTP Box -->
            <div style="background: linear-gradient(135deg, #fef2f2, #fef2f2); border: 2px solid #ef4444; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
              <p style="color: #333; font-size: 16px; margin: 0 0 15px 0;">
                Your password reset code is:
              </p>
              <div style="font-size: 36px; font-weight: bold; color: #ef4444; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                ${otp}
              </div>
            </div>
            
            <p style="color: #666; font-size: 14px; margin: 30px 0;">
              ⏰ This code will expire in <strong>10 minutes</strong> for security reasons.
            </p>
            
            <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 20px; margin: 30px 0;">
              <p style="color: #ea580c; font-size: 14px; margin: 0; line-height: 1.5;">
                <strong>⚠️ Important:</strong> If you didn't request a password reset, please ignore this email and consider changing your password as a security precaution.
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px; margin: 0;">
              © ${new Date().getFullYear()} CareerCompass. Your career security is our priority.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getWelcomeEmailTemplate(name, role) {
    const roleEmoji = {
      student: "🎓",
      mentor: "👨‍🏫",
      recruiter: "👔",
    };

    const roleMessages = {
      student:
        "Start exploring career paths, connect with mentors, and discover amazing opportunities!",
      mentor:
        "Begin sharing your expertise and help shape the next generation of professionals!",
      recruiter: "Start finding top talent and building your dream team!",
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to CareerCompass!</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #8b5cf6, #06b6d4); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">
              🎉 Welcome to CareerCompass!
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 18px;">
              Your career journey starts now
            </p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 26px;">
              Hello ${name}! ${roleEmoji[role]} 
            </h2>
            
            <p style="color: #666; font-size: 18px; margin-bottom: 30px;">
              Congratulations! Your CareerCompass account has been successfully verified. ${
                roleMessages[role]
              }
            </p>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${
                process.env.CLIENT_URL || "http://localhost:5173"
              }/dashboard" 
                 style="display: inline-block; background: linear-gradient(135deg, #10b981, #3b82f6); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Get Started Now 🚀
              </a>
            </div>
            
            <!-- Features -->
            <div style="margin: 40px 0;">
              <h3 style="color: #333; font-size: 20px; margin-bottom: 20px;">What you can do now:</h3>
              <ul style="color: #666; font-size: 16px; line-height: 1.8;">
                ${
                  role === "student"
                    ? `
                  <li>✨ Take career assessments</li>
                  <li>🎯 Explore personalized job recommendations</li>
                  <li>👥 Connect with industry mentors</li>
                  <li>🎤 Practice with AI interview preparation</li>
                `
                    : role === "mentor"
                    ? `
                  <li>👨‍🎓 Create your mentor profile</li>
                  <li>🤝 Connect with aspiring professionals</li>
                  <li>📅 Schedule mentoring sessions</li>
                  <li>💡 Share your expertise and insights</li>
                `
                    : `
                  <li>💼 Post job opportunities</li>
                  <li>🔍 Search for qualified candidates</li>
                  <li>📊 Manage applications efficiently</li>
                  <li>🏢 Build your company profile</li>
                `
                }
              </ul>
            </div>
            
            <div style="background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border-radius: 12px; padding: 25px; margin: 30px 0;">
              <p style="color: #0369a1; font-size: 16px; margin: 0; text-align: center;">
                <strong>🎯 Pro Tip:</strong> Complete your profile to get the most personalized experience!
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px; margin: 0;">
              Need help? Contact us at support@careercompass.com
            </p>
            <p style="color: #94a3b8; font-size: 12px; margin: 10px 0 0 0;">
              © ${new Date().getFullYear()} CareerCompass. Made with ❤️ for your career success.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();
