# Waltex

`Waltex` is a react functional component to store and manage cryptocurrency wallets. It supports generation of wallets. It displays generated private and public keys, provides functionality to copy them to the clipboard, and includes features for showing or hiding sensitive information.

## Features 
<b>Generate Wallet:</b> Create new wallet and view generated private and public keys.
<b>Toggle visibility:</b> Show or hide private keys and recovery phrase to generate keys.
<b>Copy to Clipboard</b> Easily copy private keys, public keys and recovery phrase

## Installation
1.  Ensure you have Node.js and npm installed on your machine.
    
2.  Clone the repository or add the component to your existing React project.
    
3.  Install the required dependencies.  
```
npm install tweetnacl bip39 ed25519-hd-key @solana/web3.js sonner lucide-react
```
4.  To run the project after install dependencies
```
npm run dev
```
5.  Import and use the  `WalletGenerator`  component in your project.
## How it Works
1. <b>Generating a Wallet:</b> 
	-   Generates a new mnemonic phrase and derives the corresponding seed.
	-   Uses the seed to generate private and public keys.
	-   Displays the generated keys and mnemonic phrase. 
2. <b>Visibility Toggle:</b> 
	-   Private keys and recovery phrases can be toggled between visible and censored (asterisks) for security.

3. <b>Clipboard Copy:</b>
	-   Provides functionality to copy private keys, public keys, and the recovery phrase to the clipboard.
## Contributing
Feel free to submit issues or pull requests. Contributions are welcome!

##  License
This project is licensed under the MIT License.