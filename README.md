# BNB Chain MCP Server

## Overview

BNB Chain MCP Server is a backend service designed to execute transactions on the Binance Smart Chain (BSC) and interact with the Binance API. It facilitates seamless interaction with both the blockchain and Binance exchange, including sending native BNB and BEP-20 token transfers, as well as placing orders and retrieving account information from Binance. The server utilizes the Model Context Protocol (MCP) framework to ensure secure, structured, and efficient transactions.

### Key Functionalities:

- Execute blockchain transactions on Binance Smart Chain (BSC)
- Interact with Binance exchange API for account information and trading
- Send native BNB transfers and BEP-20 token transactions
- Process market orders and algorithmic trading strategies
- Retrieve real-time trading data and account information
- Implement structured transactions using the Model Context Protocol framework
- Provide secure authentication and API key management for Binance integration

## Features

- **Binance Smart Chain Integration**: Connect to BSC network for blockchain transactions and token interactions
- **Binance API Integration**: Connect to Binance exchange for account information and trading operations
- **Account Management**: Retrieve detailed account information, balances, and trading history
- **Market Data Access**: Access real-time order books and market data for informed trading decisions
- **Order Execution**: Place spot market orders with flexible quantity specifications
- **Algorithmic Trading Support**: Implement Time-Weighted Average Price (TWAP) orders to minimize market impact
- **Automated Trading**: Execute trades programmatically based on predefined strategies
- **Secure Authentication**: Manage API keys and secure connections to Binance services
- **Comprehensive Error Handling**: Detailed error reporting for transaction failures and API issues
- **MCP Framework Compliance**: Standardized approach for structured application interactions

## Requirements

Before setting up the BNB Chain MCP Server, ensure you have the following installed:

- Node.js (v16 or later)
- npm or yarn
- A valid Binance Smart Chain (BSC) wallet private key
- Binance API key and secret (for Binance exchange integration)

## Installation

Clone the repository and install dependencies:

```sh
git clone https://github.com/your-repo/bsc-mcp-server.git
cd bsc-mcp-server
npm install  # or yarn install
```

## Configuration

To configure the server, create a `.env` file in the root directory and specify the following variables:

```sh
# Binance API Configuration
BINANCE_API_KEY=your_binance_api_key_here
BINANCE_API_SECRET=your_binance_api_secret_here
```

## Creating a Binance API Key

Before using the Binance API integration, you need to create an API key. This allows you to connect to Binance's servers via several programming languages, pull data from Binance, and interact with external applications. You can view your wallet and transaction data, make trades, and deposit and withdraw funds in third-party programs.

**Prerequisites:**
- You need to make a deposit of any amount to your Spot Wallet to activate your account
- Complete identity verification
- Enable two-factor authentication (2FA) on your account

**Steps to create a Binance API Key:**

1. Log in to your Binance account and click the profile icon, then [Account].
   ![Binance Homepage](readme/homepage.png)

2. Go to [API Management] then click [Create API].
   ![API Management](readme/API%20Management.png)

3. Select your preferred API Key type:
   - System-generated API keys (HMAC symmetric encryption) - You'll get the API key and the Secret Key.
   - Self-generated API keys (Ed25519 or RSA asymmetric encryption) - You'll receive an API key, but you have to create your own public-private key pair.
   ![API Key Type](readme/API%20Key%20Type.png)

4. Enter a label/name for your API Key.
   ![Create API key](readme/Create%20API%20key.png)

5. Verify with your 2FA devices and passkeys.
   ![Security Management](readme/Security%20Management.png)

6. Your API key is now created.

For more details on Binance API, please refer to the [Binance API Documentation](https://developers.binance.com/en/).


## Integration with Claude Desktop

Before integrating this MCP server with Claude Desktop, ensure you have the following installed:

- Claude Desktop

Then build the server using the following command:

```sh
npm run build  
```

To add this MCP server to Claude Desktop:

Create or edit the Claude Desktop configuration file at:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

Add the following configuration:

```json
{
    "mcpServers": {
        "bsc-mcp": {
            "command": "node",
            "args": [
                "/Users/Username/Desktop/binance-mcp/build/index.js"
            ],
            "env": {
                "BINANCE_API_KEY": "BINANCE_API_KEY",
                "BINANCE_API_SECRET": "BINANCE_API_SECRET"
            },
            "disabled": false,
            "autoApprove": []
        }
    }
}
```

Make sure to pass the correct location of the `index.js` file in the `command` and `args` fields.

Restart Claude Desktop for the changes to take effect.

## Usage (For Connecting MCP HOST other than Claude)

### Start the Server

To start the MCP server, run:

```sh
npm start  # or node index.js
```

## Functions


### Binance API Functions

1. **Get Binance Account Information - `binanceAccountInfo`**

   Retrieves comprehensive information about your Binance account, including balances, trading permissions, and account status.

2. **Get Binance Account Snapshot - `binanceAccountSnapshot`**

   Gets a snapshot of your Binance account status, including current BTC price information. Includes history for the last 30 days.

3. **Check Binance Order Book - `binanceOrderBook`**
    ```json
    {
        "symbol": "BTCUSDT"
    }
    ```
    Retrieves the current order book for a specified trading pair, showing available buy and sell orders up to 50 levels deep.

4. **Place Spot Market Order - `binanceSpotPlaceOrder`**
    ```json
    {
        "symbol": "BTCUSDT",
        "side": "BUY",
        "quantity": 0.001,
        // OR
        "quoteOrderQty": 100
    }
    ```
    Places a market order for immediate execution at the best available price. Use `quantity` to specify the amount of base asset or `quoteOrderQty` to specify the amount in quote currency. Suitable for small orders.

5. **Place TWAP Order - `binanceTimeWeightedAveragePriceFutureAlgo`**
    ```json
    {
        "symbol": "BTCUSDT",
        "side": "BUY",
        "quantity": 1.0,
        "duration": 3600
    }
    ```
    Places a Time-Weighted Average Price (TWAP) order that executes gradually over a specified duration to minimize market impact. Suitable for large orders that might otherwise cause significant price movements.

## Model Context Protocol (MCP)

The **Model Context Protocol (MCP)** is an open standard designed to enhance the way applications interact with AI models and blockchain-based computational systems. MCP establishes structured context that improves the efficiency of automated transactions and decentralized applications.

### Benefits of MCP:

- **Standardization**: Defines a unified approach for application interactions.
- **Efficiency**: Reduces computational overhead and improves transaction speed.
- **Interoperability**: Supports integration across multiple platforms and blockchain ecosystems.

## Error Handling

When a transaction fails, the server returns an error message with details. Check the console logs for more debugging information. Common error scenarios include:

- Insufficient funds in the wallet
- Invalid recipient address
- Network congestion or RPC issues
- Binance API authentication errors
- Trading limit restrictions


## License

This project is open-source under the MIT License.

For contributions, bug reports, or feature requests, submit an issue on [GitHub](https://github.com/your-repo/bsc-mcp-server).