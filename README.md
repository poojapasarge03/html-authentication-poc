# HTML Authentication System POC

## Project Description

This is a simple HTML-based authentication system Proof of Concept (POC) that demonstrates basic user authentication flow using only plain HTML. No CSS, JavaScript, or any frameworks are used in this project.

## Pages

This project contains exactly 5 HTML pages:

1. **login.html** - User login page
2. **register.html** - New user registration page
3. **forgot-password.html** - Password recovery request page
4. **reset-password.html** - Password reset page
5. **dashboard.html** - User dashboard after successful login

## Redirection Flow

The navigation flow between pages works as follows:

- **Login → Dashboard**: After submitting login credentials
- **Login → Register**: Via "Register" link
- **Login → Forgot Password**: Via "Forgot Password?" link
- **Register → Login**: After successful registration or via "Already have an account?" link
- **Forgot Password → Reset Password**: After submitting email
- **Forgot Password → Login**: Via "Back to Login" link
- **Reset Password → Login**: After resetting password
- **Dashboard → Login**: Via "Logout" link

## Repository

GitHub Repository: https://github.com/YOURUSERNAME/html-authentication-poc

## Important Notes

- This is a simple HTML-based authentication POC
- No CSS or JavaScript is used
- Repository is public
- All redirections work using HTML form actions and anchor tags
- This is for demonstration purposes only and does not include actual authentication logic
