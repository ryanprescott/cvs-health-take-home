# CVS Health Take Home Project

## Project Overview

This project is a take-home assignment for CVS Health. It demonstrates the ability to build a simple application using the specified technologies and requirements.

## Technologies Used

- Language: TypeScript
- Framework: Fastify
- Types and Schemas: Zod
- Testing Suite: Jest
- Package Manager: pnpm

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/ryanprescott/cvs-health-take-home.git
   ```
2. Navigate to the project directory:
   ```bash
   cd cvs-health-take-home
   ```
3. Install the required dependencies:
   ```bash
   pnpm install
   ```
4. Set up the environment variables by copying `.env.example` to `.env` and adding the API key for The Movie Database.

5. Run the application:
   ```bash
   pnpm start
   ```

## Usage

- Access the API data by querying `http://localhost:3000?year=xxxx` in Postman, Insomnia, cURL, or a similar tool. Year should be a four digit year.

## Testing

To run the tests, use the following command:

```bash
pnpm test
```

## Contact

For any questions or feedback, please contact [ryanpprescott@outlook.com](mailto:ryanpprescott@outlook.com).
