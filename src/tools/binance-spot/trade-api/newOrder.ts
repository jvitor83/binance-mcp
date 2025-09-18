// src/tools/binance-spot/trade-api/newOrder.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { spotClient } from "../../../config/binanceClient.js";

export function registerBinanceNewOrder(server: McpServer) {
    server.tool(
        "BinanceNewOrder",
        "Create a new order on Binance for a specific trading pair.",
        {
            symbol: z.string().describe("Symbol of the trading pair (e.g., BTCUSDT)"),
            side: z.enum(["BUY", "SELL"]).describe("Order side: BUY or SELL"),
            type: z.enum(["LIMIT", "MARKET", "STOP_LOSS", "STOP_LOSS_LIMIT", "TAKE_PROFIT", "TAKE_PROFIT_LIMIT", "LIMIT_MAKER"]).describe("Order type"),
            timeInForce: z.enum(["GTC", "IOC", "FOK"]).optional().describe("Time in force"),
            quantity: z.number().optional().describe("Order quantity (required for most types; optional for MARKET when quoteOrderQty provided)"),
            quoteOrderQty: z.number().optional().describe("Quote order quantity (MARKET orders only; use instead of quantity)"),
            price: z.number().optional().describe("Order price (required for LIMIT / *_LIMIT / LIMIT_MAKER)"),
            newClientOrderId: z.string().optional().describe("Client order ID"),
            stopPrice: z.number().optional().describe("Stop price (required for STOP_LOSS / TAKE_PROFIT / *_LIMIT variants)"),
            icebergQty: z.number().optional().describe("Iceberg quantity (Only for LIMIT / STOP_LOSS_LIMIT / TAKE_PROFIT_LIMIT)"),
            newOrderRespType: z.enum(["ACK", "RESULT", "FULL"]).optional().describe("Response type")
        },
        async ({ symbol, side, type, timeInForce, quantity, quoteOrderQty, price, newClientOrderId, stopPrice, icebergQty, newOrderRespType }) => {
            try {
                // Custom validation before calling Binance to give clearer error messages
                const missing: string[] = [];

                const needsPriceTypes = ["LIMIT", "STOP_LOSS_LIMIT", "TAKE_PROFIT_LIMIT", "LIMIT_MAKER"];
                const needsStopPriceTypes = ["STOP_LOSS", "STOP_LOSS_LIMIT", "TAKE_PROFIT", "TAKE_PROFIT_LIMIT"];
                const needsTimeInForceTypes = ["LIMIT", "STOP_LOSS_LIMIT", "TAKE_PROFIT_LIMIT", "LIMIT_MAKER"]; // LIMIT_MAKER technically doesn't require but include only if user sets? We'll keep optional but not force.

                // Quantity / quoteOrderQty rules
                if (type === "MARKET") {
                    if (quantity === undefined && quoteOrderQty === undefined) {
                        missing.push("quantity or quoteOrderQty (one is required for MARKET orders)");
                    }
                } else {
                    if (quantity === undefined) missing.push("quantity");
                }

                if (needsPriceTypes.includes(type) && price === undefined) missing.push("price");
                if (needsStopPriceTypes.includes(type) && stopPrice === undefined) missing.push("stopPrice");
                if (needsTimeInForceTypes.includes(type) && type !== "LIMIT_MAKER" && timeInForce === undefined) missing.push("timeInForce");

                if (missing.length) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Validation failed. Missing required field(s) for ${type} order: ${missing.join(", ")}`
                            }
                        ],
                        isError: true
                    };
                }

                const params: any = { 
                    symbol,
                    side,
                    type,
                    // Only include quantity if provided; Binance rejects 0/undefined
                };
                if (quantity !== undefined) params.quantity = quantity;
                
                if (timeInForce) params.timeInForce = timeInForce;
                if (quoteOrderQty !== undefined) params.quoteOrderQty = quoteOrderQty;
                if (price !== undefined) params.price = price;
                if (newClientOrderId) params.newClientOrderId = newClientOrderId;
                if (stopPrice !== undefined) params.stopPrice = stopPrice;
                if (icebergQty !== undefined) params.icebergQty = icebergQty;
                if (newOrderRespType) params.newOrderRespType = newOrderRespType;
                
                const response = await spotClient.restAPI.newOrder(params);

                const data = await response.data();

                return {
                    content: [
                        {
                            type: "text",
                            text: `New order successfully created. Response: ${JSON.stringify(data)}`
                        }
                    ]
                };
            } catch (error: any) {
                // Surface Binance API error body if present
                let errorMessage = error instanceof Error ? error.message : String(error);
                if (error?.response) {
                    try {
                        const body = await error.response.text?.() ?? await error.response.data?.();
                        if (body) errorMessage += ` | body: ${body}`;
                    } catch {}
                }
                return {
                    content: [
                        { type: "text", text: `Failed to create new order: ${errorMessage}` }
                    ],
                    isError: true
                };
            }
        }
    );
}