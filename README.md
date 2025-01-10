# Patientor: a patient record system

[https://patientor.azurewebsites.net/](https://patientor.azurewebsites.net/)

<img src="preview.gif" width="300" alt="preview">

## Project description

The project is a patient record system that allows users to view and add patient records. The data is stored in a JSON file and the application is built using React.

## Prerequisites

- Node v18.0 or later

## Getting started

### Production

1. Clone the repository and `cd` to it
2. Run `npm install` to install the backend dependencies
3. Run `npm tsc` to compile the TypeScript files
4. `cd patientor-frontend` to go to the frontend directory
5. Run `npm install` to install the frontend dependencies
6. Run `npm run build` to build the frontend
7. Run `cd .. && cp -r patientor-frontend/dist ..` to copy the build files to the root directory
8. Run `npm start` to start the server

### Development

1. Clone the repository and `cd` to it
2. Run `npm install` to install the backend dependencies
3. Run `npm run dev` to start the backend in development mode
4. In a new terminal `cd patientor-frontend` to go to the frontend directory
5. Run `npm install` to install the frontend dependencies
6. Run `npm run dev` to start the frontend in development mode

## Credits

[FullStackOpen](https://fullstackopen.com/en/) by the University of Helsinki.
