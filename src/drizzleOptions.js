import Credential from "@/contracts/Credential.json";

const options = {
  web3: {
    block: false,
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:8545"
    }
  },
// The contracts to monitor
  contracts: [Credential],
  /*events: {
    Credential: []
  },*/
  polls: {
    // check accounts ever 15 seconds
    accounts: 3000
  }
};
export default options;
