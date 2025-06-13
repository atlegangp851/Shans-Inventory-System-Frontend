// Change to backend directory first
process.chdir('./backend');
require('dotenv').config();

console.log('=== Environment Variables Test ===');
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);
console.log('JWT_SECRET value:', process.env.JWT_SECRET);
console.log('Working directory:', process.cwd());
console.log('NODE_ENV:', process.env.NODE_ENV);
