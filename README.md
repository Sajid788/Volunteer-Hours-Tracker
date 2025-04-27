# Valuteer - Volunteer Hour Tracking System

Valuteer is a comprehensive web application designed to streamline the process of tracking, managing, and verifying volunteer hours. It serves as a bridge between volunteers, organizations, and administrators, providing a transparent and efficient platform for volunteer hour management.

## Features

### For Volunteers
- **Hour Submission**: Easily submit volunteer hours with detailed descriptions
- **Dashboard Overview**: View all submitted hours with their approval status
- **Stats Tracking**: Monitor total approved hours and pending submissions
- **Edit Capability**: Modify pending hour submissions as needed

### For Organizations
- **Hour Verification**: Review and approve/reject volunteer hour submissions
- **Volunteer Management**: Track hours submitted for your organization
- **Dashboard Insights**: View statistics on volunteer contributions

### For Administrators
- **Complete System Control**: Manage all users, organizations, and hour submissions
- **Data Modification**: Edit or delete any record as needed
- **System Oversight**: Monitor all activities across the platform

## Technology Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. **Clone the repository**
   ```
   git clone https://github.com/yourusername/valuteer.git
   cd valuteer
   ```

2. **Install backend dependencies**
   ```
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the backend directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/valuteer
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   ```

5. **Start the application**
   
   For development mode:
   ```
   # In the backend directory
   npm run dev
   
   # In the frontend directory (in a separate terminal)
   npm start
   ```

## Usage

### Account Creation

1. Register as a volunteer or organization
2. Log in with your credentials
3. Set up your profile

### Submitting Hours (Volunteers)

1. Navigate to the "Submit Hours" page
2. Select the organization
3. Enter hours, date, and description
4. Submit for approval

### Approving Hours (Organizations)

1. View pending submissions in your dashboard
2. Review the details of each submission
3. Approve or reject with a single click

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive token

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

### Hours
- `GET /api/hours` - Get all hours (filtered by user role)
- `POST /api/hours` - Submit new hours
- `PUT /api/hours/:id` - Update hour entry
- `DELETE /api/hours/:id` - Delete hour entry

### Organizations
- `GET /api/organizations` - Get all organizations
- `POST /api/organizations` - Create new organization (admin only)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Admin Credentials
- Email :- admin@example.com
- Password :- admin@123

## Screenshot
![image](https://github.com/user-attachments/assets/e6f11d90-725f-4885-87df-8d6899352270)
![image](https://github.com/user-attachments/assets/fbd5cc7d-837b-4eff-8b3b-7432fd44dd45)
![image](https://github.com/user-attachments/assets/8dffb9ff-fcf2-4cda-9ba6-166ef212f0b9)
![image](https://github.com/user-attachments/assets/4fb0fdfb-f23b-4565-94d0-24cbd4374620)
![image](https://github.com/user-attachments/assets/d02dc8e7-46c9-4b4a-bd2a-474fa4498637)
![image](https://github.com/user-attachments/assets/6c3adde4-66a5-45b7-9e23-263cd0c1a601)
![image](https://github.com/user-attachments/assets/fa46bf70-cd51-4474-9122-599ffa406f43)
![image](https://github.com/user-attachments/assets/c7015035-b8d8-4ab2-a0de-9ebc969ae7ab)




## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/) 
