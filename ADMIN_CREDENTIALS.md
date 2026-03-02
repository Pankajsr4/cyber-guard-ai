# 🔐 Admin Login Credentials

## Primary Admin Account

### Official Admin Credentials:
```
Email: kumarpankaj9982@gmail.com
Password: Pankaj@2003
```

**This is the main admin account with full access to the system.**

---

## Admin Access

### Primary Admin Login:
```
✅ Email: kumarpankaj9982@gmail.com
✅ Password: Pankaj@2003
✅ Name: Pankaj Kumar
✅ Role: Admin
```

### Alternative Admin Accounts (For Testing):
Any email with "admin" in it will also work as admin:
```
✅ admin@cyberguard.com (any password)
✅ admin@example.com (any password)
✅ administrator@test.com (any password)
```

---

## Quick Admin Login

### Recommended Admin Account:
```
Email: kumarpankaj9982@gmail.com
Password: Pankaj@2003
```

---

## Regular User Login

### Regular User Examples:
```
❌ user@example.com (any password - NOT admin)
❌ john@company.com (any password - NOT admin)
❌ test@gmail.com (any password - NOT admin)
```

Any email WITHOUT "admin" in it will be a regular user.

---

## Important: Website Requires Login

### First-Time Visitors:
When someone opens the website (http://localhost:3000), they will be:
1. **Automatically redirected to /login page**
2. Must sign up or login to access the website
3. Cannot view any pages without authentication

### Authentication Flow:
```
1. User visits http://localhost:3000
2. System checks for authentication token
3. If NO token → Redirect to /login
4. User must login or signup
5. After login → Access granted to website
```

---

## Login Process

1. Go to: http://localhost:3000 (auto-redirects to /login)
2. Enter email: `kumarpankaj9982@gmail.com`
3. Enter password: `Pankaj@2003`
4. Click "Sign In"
5. You'll be redirected to dashboard with full admin access

---

## What Admins Can See

### Admin Navigation:
```
Home | Dashboard | Analyze | Assistant | Settings | Admin | Logout
```

### Regular User Navigation:
```
Home | Dashboard | Analyze | Assistant | Settings | Logout
```

---

## Admin Panel Features

### Overview Tab:
- Total users count
- Active users
- Total analyses
- Flagged content
- Model performance metrics
- Recent activity

### Users Tab:
- Complete list of all 10 users
- User details (ID, Name, Email, Role, Status)
- Join date and analysis count
- Search functionality
- View/Edit actions

### Review Queue Tab:
- 5 flagged content items
- Risk scores and status
- Date information
- View details button

### Configuration Tab:
- Model settings
- Threshold adjustments
- System configuration

---

## User List in Admin Panel

The admin can see all these users:

| ID | Name | Email | Role | Status | Analyses |
|----|------|-------|------|--------|----------|
| 1 | John Doe | john@example.com | User | Active | 45 |
| 2 | Jane Smith | jane@example.com | User | Active | 32 |
| 3 | Pankaj Kumar | kumarpankaj9982@gmail.com | Admin | Active | 156 |
| 4 | Mike Johnson | mike@company.com | User | Active | 28 |
| 5 | Sarah Williams | sarah@test.com | User | Active | 19 |
| 6 | David Brown | david@example.com | User | Inactive | 12 |
| 7 | Emily Davis | emily@company.com | User | Active | 8 |
| 8 | Robert Wilson | robert@test.com | User | Active | 5 |
| 9 | Lisa Anderson | lisa@example.com | User | Active | 3 |
| 10 | James Taylor | james@company.com | User | Active | 2 |

---

## Testing Admin Features

### Test 1: Admin Login
```
1. Go to http://localhost:3000 (redirects to /login)
2. Email: kumarpankaj9982@gmail.com
3. Password: Pankaj@2003
4. Check: Admin link appears in navigation
5. Check: Can access /admin page
6. Check: Welcome message shows "Welcome Pankaj!"
```

### Test 2: Regular User Login
```
1. Go to /login
2. Email: user@example.com
3. Password: anything
4. Check: NO Admin link in navigation
5. Check: Cannot access /admin (redirects to dashboard)
```

### Test 3: View All Users
```
1. Login as admin (kumarpankaj9982@gmail.com)
2. Go to Admin panel
3. Click "Users" tab
4. See all 10 users with complete details
```

### Test 4: Authentication Required
```
1. Open new incognito window
2. Go to http://localhost:3000
3. Check: Automatically redirected to /login
4. Cannot access any page without login
```

---

## Dark Theme

### How to Enable:
1. Login (as admin or regular user)
2. Go to Settings
3. Toggle "Theme" switch
4. Entire website turns dark mode

### Dark Mode Features:
- ✅ Dark background (#1f2937)
- ✅ Light text (#f3f4f6)
- ✅ Applies to entire website
- ✅ Persists across page navigation
- ✅ Saved in localStorage

---

## Security Notes

### Current Implementation:
- ✅ Authentication required for all pages
- ✅ Specific admin credentials validated
- ✅ Auto-redirect to login for unauthenticated users
- ⚠️ Demo-only authentication (no backend validation)
- ⚠️ Any password works for non-admin users

### For Production:
- ✅ Implement real backend authentication
- ✅ Use JWT tokens with role claims
- ✅ Validate admin role on backend
- ✅ Secure password hashing (bcrypt)
- ✅ Session management
- ✅ API endpoint protection
- ✅ Rate limiting
- ✅ CSRF protection

---

## Quick Reference

### Admin Login:
```bash
URL: http://localhost:3000 (auto-redirects to /login)
Email: kumarpankaj9982@gmail.com
Password: Pankaj@2003
```

### Admin Panel:
```bash
URL: http://localhost:3000/admin
Access: Admin users only
Features: Users, Review Queue, Configuration
```

### Settings:
```bash
URL: http://localhost:3000/settings
Theme Toggle: Light/Dark mode for entire site
```

---

## Summary

✅ **Admin Email**: kumarpankaj9982@gmail.com  
✅ **Admin Password**: Pankaj@2003  
✅ **Admin Name**: Pankaj Kumar  
✅ **Authentication**: Required for all pages  
✅ **Auto-Redirect**: Unauthenticated users → /login  
✅ **Admin Panel**: Full user list, review queue  
✅ **Dark Theme**: Works across entire website  

**Ready to use!** 🚀
