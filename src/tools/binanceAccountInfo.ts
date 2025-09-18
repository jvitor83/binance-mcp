import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { spotClient } from "../config/binanceClient.js";

export function registerBinanceAccountInfo(server: McpServer) {
  server.tool(
    "binanceAccountInfo",
    "check binance account info",
    {},
    async ({}) => {
      try {
        // Get account information using the correct REST API method
        const accountResponse = await spotClient.restAPI.getAccount({});
        const accountInfo = await accountResponse.data();
        
        // Get BTC price
        const btcPriceResponse = await spotClient.restAPI.tickerPrice({ symbol: "BTCUSDT" });
        const btcPrice = await btcPriceResponse.data();
        return {
          content: [
            {
              type: "text",
              text: `Get binance account info successfully. data: ${JSON.stringify(accountInfo)}`,
            },
            {
              type: "text",
              text: `Get BTC price successfully. data: ${JSON.stringify(btcPrice)}`,
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return {
          content: [
            { type: "text", text: `Server failed: ${errorMessage}` },
          ],
          isError: true,
        };
      }
    }
  );
}