// import React, { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { setProvider } from "../store";
// import { BrowserProvider } from "ethers";

// const ProviderSetup: React.FC = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const initializeProvider = async () => {
//       if ((window as any).ethereum) {
//         const provider = new BrowserProvider((window as any).ethereum);
//         try {
//           await provider.send("eth_requestAccounts", []);
//           dispatch(setProvider(provider));
//         } catch (error) {
//           console.error("User denied account access", error);
//         }
//       } else {
//         console.error("No Ethereum provider found");
//       }
//     };

//     initializeProvider();
//   }, [dispatch]);

//   return <div>Provider setup complete</div>;
// };

// export default ProviderSetup;