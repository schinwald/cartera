![Cartera](/logo.svg)

## Description

A cryptocurrency wallet manager that streamlines transactions, removes barriers, and emphasizes transparency without compromising security. This is a proof of concept which was tested using the BlockCypher API on the BCY.test chain. Some of the key features include:
- [x] Consolidates wallet addresses
- [x] Wallet alias renaming
- [x] Generates QR Codes for available wallet addresses
- [x] Exchanging cryptocurrencies
- [x] Transaction viewing

## Preview

None

## Learning Outcomes

- BlockCypher
    - It is a good idea to remove private keys from a server after a certain period of time
    - Addresses should not be used repeatedly to avoid transaction tracking
    - Transaction signing uses the Elliptic Curve Digital Signing Algorithm (ECDSA)
    - Polling should be separated from frontend and backend to avoid excessive API calls
    - Transactions consume the entire balance of the sender's address and then refund excess funds
    - Fees are included in each transaction (presumably given to miners)
- Express
    - Next function doesn't exit router or middleware logic
    - Finalizing a response doesn't exit router or middleware logic
- Mongoose
    - Is an Object Document Mapper (ODM)
    - Allows you to use Mongodb easily with JavaScript
- SWR (stale-while-revalidate)
    - Cached fetches allow you to fetch data within child components without additional fetches
    - Interval fetches are great for polling
    - Mutations can trigger new fetches
    - Easily updates data and by extension react components
- Material UI
    - A great tool for generating responsive and nice looking react components
    - Streamlines themes so that you can use dark mode easily using a context provider
    - Creating custom style components is really easy
- React
    - useImperativeHandle is a great option for exposing react component ref methods
- User Interface
    - Rotating background images are really effective
    - Oppositely rotating mitigates vertigo

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
