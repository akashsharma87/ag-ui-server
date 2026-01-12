const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Server is missing OpenAI API Key' });
    }

    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendEvent = (type, data) => {
        res.write(`data: ${JSON.stringify({ type, data })}\n\n`);
    };

    try {
        const openai = new OpenAI({ apiKey });

        // Send an "thinking" activity event
        sendEvent('activity', { status: 'thinking', message: 'Analyzing request...' });

        // System prompt to guide the agent to use the "generate_ui" tool structure
        // We will simulate tool calling by instructing the model to output specific JSON blocks for UI.
        // Or we can use actual tool calling and intercept the tool call to send a 'ui' event.

        const tools = [
            {
                type: "function",
                function: {
                    name: "generate_ui",
                    description: "Generate a UI component for the user.",
                    parameters: {
                        type: "object",
                        properties: {
                            component: {
                                type: "string",
                                enum: ["WeatherCard", "StockChart", "TodoList", "LoginForm"],
                                description: "The type of component to render"
                            },
                            props: {
                                type: "object",
                                description: "The props for the component"
                            }
                        },
                        required: ["component", "props"]
                    }
                }
            }
        ];

        const messages = [
            { role: "system", content: "You are an AG-UI compatible agent. You can answer questions or generate UI components. When the user asks for a specific interface or data visualization, use the 'generate_ui' tool. If the user asks 'what is ag-ui', explain it briefly and offer to show a demo." },
            ...history,
            { role: "user", content: message }
        ];

        const stream = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: messages,
            tools: tools,
            tool_choice: "auto",
            stream: true,
        });

        let currentToolCall = null;

        for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta;

            // Handle Content
            if (delta?.content) {
                sendEvent('text', delta.content);
            }

            // Handle Tool Calls (streaming)
            if (delta?.tool_calls) {
                const toolCallDelta = delta.tool_calls[0];

                if (toolCallDelta.id) {
                    // New tool call
                    if (currentToolCall) {
                        // Determine if we need to flush previous (not needed for 1 at a time usually)
                    }
                    currentToolCall = {
                        id: toolCallDelta.id,
                        name: toolCallDelta.function.name,
                        arguments: ""
                    };
                    sendEvent('activity', { status: 'generating_ui', message: 'Generating UI component...' });
                }

                if (toolCallDelta.function?.arguments) {
                    currentToolCall.arguments += toolCallDelta.function.arguments;
                }
            }
        }

        // Process the completed tool call if any
        if (currentToolCall && currentToolCall.name === 'generate_ui') {
            try {
                const args = JSON.parse(currentToolCall.arguments);
                // In a real AG-UI, we'd send a 'ui' event with the schema.
                sendEvent('ui', args);
                sendEvent('text', `\n\nI've generated a ${args.component} for you.`);
            } catch (e) {
                console.error("Error parsing tool arguments", e);
                sendEvent('text', "\n(Error generating UI)");
            }
        }

        res.end();

    } catch (error) {
        console.error(error);
        sendEvent('error', error.message);
        res.end();
    }
});

app.listen(PORT, () => {
    console.log(`AG-UI Demo Server running on port ${PORT}`);
});
