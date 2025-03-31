import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from "dotenv";
import { registerBinanceAccountInfo } from "./tools/binanceAccountInfo.js";
import { registerBinanceOrderBook } from "./tools/binanceOrderBook.js";
import { registerBinanceTimeWeightedAveragePriceFutureAlgo } from "./tools/binanceTimeWeightedAveragePriceFutureAlgo.js";
import { registerBinanceSpotPlaceOrder } from "./tools/binanceSpotPlaceOrder.js";

// Load environment variables
dotenv.config();

// Import tool registrations

// Main server entry
export async function main() {
    const server = new McpServer({
        name: "bsc-mcp",
        version: "1.0.0",
    });

    // Register all tools
    registerBinanceAccountInfo(server)
    registerBinanceOrderBook(server)
    registerBinanceTimeWeightedAveragePriceFutureAlgo(server)
    registerBinanceSpotPlaceOrder(server)

    const transport = new StdioServerTransport();

    transport.onmessage = (message /** @type {JSONRPCMessage} */) => {
        console.log("📩 Received message:", JSON.stringify(message, null, 2));
    };

    transport.onerror = (error) => {
        console.error("🚨 Transport error:", error);
    };

    await server.connect(transport);
}
main()