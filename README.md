# Library Application

https://library-creend.vercel.app/

📚 Welcome to the Library Application repository! This application is built with NEXT.js and TypeScript and uses Prisma and MySQL for database management. It also leverages TRPC for communication between the server and client. The Library Application provides features for managing library resources, including user accounts, book borrowing, and administrative functions.

## Features

✨ User Management:
- Admin account can create reader accounts.
- Users can update their profile information, including password.

📖 Book Management:
- Admin can add new books.
- Admin can edit existing books.
- Admin can remove user accounts.

📚 Borrowing Management:
- Users can request to borrow books.
- Admin must approve each borrowing request.
- Books have an availability count, which is updated upon approval or return.

## Technologies Used

🚀 NEXT.js
🔷 TypeScript
🛠️ Prisma
🐬 MySQL
🔌 TRPC
🎨 Tailwind CSS

## Getting Started

To get started with the Library Application, follow these steps:

1. Clone the repository: `git clone https://github.com/creend/library.git`
2. Install the dependencies: `npm install`
3. Set up the MySQL database connection details in the `.env` file.
4. Push schema from file to your database using Prisma: `npx prisma db push`
5. Manually create admin user, use prisma studio to do it: `npx prisma studio`
6. Start the development server: `npm run dev`

🌟 Congratulations! You now have the Library Application up and running locally.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any inquiries or feedback, please reach out to the project maintainer:

👤 Creend

📧 Email: creend42@gmail.com

💼 GitHub: [@creend](https://github.com/creend)
