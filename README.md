# Asana Chatbot

Asana Chatbot is a JavaScript module that allows you to easily integrate Asana chatbot into your website.

## Usage

To use the Asana Chatbot, follow these steps:

1. Include the built app in your website by adding the following script tag to your HTML file:

   ```html
   <script src="path/to/asana-chatbot.js"></script>
   ```

2. Create an empty `<div>` element on your page to serve as the container for the chatbot:

   ```html
   <div id="chatbot"></div>
   ```

3. Initialize the chatbot by calling the `AsanaChatbot()` function with the desired configuration options:

   ```javascript
   AsanaChatbot({
     element: "#chatbot",
     backgroundImage: null,
     apiPath: "https://your-api.com/chat",
     width: "30vw",
     // Add other configuration options here
   });
   ```

   Alternatively, you can pass the element directly using the `document.querySelector()` function:

   ```javascript
   AsanaChatbot({
     element: document.querySelector("#chatbot"),
     backgroundImage: null,
     apiPath: "https://your-api.com/chat",
     width: "30vw",
     // Add other configuration options here
   });
   ```

4. Customize the appearance and behavior of the chatbot by providing values for the configuration options. See the available options below.

5. Save your changes and run your website. The chatbot should now be visible and ready to interact with users.

## Configuration Options

The following configuration options are available for customizing the behavior and appearance of the chatbot:

| Option               | Type                                                                                                         | Default Value | Required                                    | Description                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------ | ------------- | ------------------------------------------- | ---------------------------------------------------------------------------------- |
| `element`            | `HTMLElement \| string`                                                                                      | -             | Yes                                         | The HTML element or selector for the chatbot container.                            |
| `apiPath`            | `string \| null`                                                                                             | `null`        | Yes if `sendMessageApiCall` is not provided | The URL of the Asana Chatbot API endpoint.                                         |
| `sendMessageApiCall` | `(prompt: string, history: MessageHistory[], messages: MessageTypes[]) => Promise<{ text: string }> \| null` | `null`        | Yes if `apiPath` is not provided            | A function that makes an API call to send a message.                               |
| `primaryColor`       | `string`                                                                                                     | ![#f06a6a](https://placehold.co/15x15/f06a6a/f06a6a.png) `#f06a6a`             | No                                          | The primary color of the chatbot interface.                                        |
| `secondaryColor`     | `string`                                                                                                     | ![#f4f7f9](https://placehold.co/15x15/f4f7f9/f4f7f9.png) `#f4f7f9`             | No                                          | The secondary color of the chatbot interface.                                      |
| `primaryTextColor`   | `string`                                                                                                     | ![#ffffff](https://placehold.co/15x15/ffffff/ffffff.png) `#ffffff`            | No                                          | The color of the primary text in the chatbot interface.                            |
| `secondaryTextColor` | `string`                                                                                                     | ![#000000](https://placehold.co/15x15/000000/000000.png) `#000000`             | No                                          | The color of the secondary text in the chatbot interface.                          |
| `badgeColor`         | `string`                                                                                                     | ![#f22424](https://placehold.co/15x15/f22424/f22424.png) `#f22424`             | No                                          | The color of the chatbot notification badge.                                                    |
| `badgeTextColor`     | `string`                                                                                                     | ![#ffffff](https://placehold.co/15x15/ffffff/ffffff.png) `#ffffff`             | No                                          | The color of the text on the chatbot  notification badge.                                        |
| `fontFamily`         | `string`                                                                                                     | `Lato, sans-serif`             | No                                          | The font family to use in the chatbot interface.                                   |
| `headerText`         | `string`                                                                                                     | `Assistant Asana`             | No                                          | The text to display in the chatbot header.                                         |
| `headerIcon`         | `string`                                                                                                     | `Asana logo`            | No                                          | The URL of the icon to display in the chatbot header.                      |
| `avatar`             | `string`                                                                                                     | `Asana logo`             | No                                          | The URL of the avatar image to display in the chatbot interface.           |
| `backgroundImage`    | `string`                                                                                                     | `default background image`             | No                                          | The URL of the background image for the chatbot interface.                 |
| `width`              | `string`                                                                                                     | `30vw`             | No                                          | The width of the chatbot interface. You can use CSS units like `px`, `%`, or `vw`. |
| `firstMessage`       | `string`                                                                                                     | "Bonjour je suis votre assistant Asana...."             | No                                          | The initial message to display when the chatbot is opened.                         |
| `errorMessage`       | `string`                                                                                                     | "Une erreur est survenue, merci de réessayer plus tard"             | No                                          | The error message to display if there is a problem with the chatbot API.           |
| `openIcon`           | `string`                                                                                                     | `Asana logo`             | No                                          | The URL of the icon to display when the chatbot is closed.                 |
| `closeIcon`          | `string`                                                                                                     | `Close icon`             | No                                          | The URL of the icon to display when the chatbot is open.                   |
| `showEmoji`          | `boolean`                                                                                                    | `false`             | No                                          | Set to `true` to enable the emoji picker in the chatbot interface.                 |
| `showPreview`        | `boolean`                                                                                                    | `true`             | No                                          | Set to `true` to enable received message preview in the chatbot interface.         |
| `onOpen`             | `() => any`                                                                                                  | -             | No                                          | A callback function called when the chatbot is opened.                             |
| `onClose`            | `() => any`                                                                                                  | -             | No                                          | A callback function called when the chatbot is closed.                             |
| `onOpenEmoji`        | `() => any`                                                                                                  | -             | No                                          | A callback function called when the emoji picker is opened.                        |
| `onSendMessage`      | `(message: string, history: MessageHistory[]) => any`                                                        | -             | No                                          | A callback function called when a message is sent.                                 |
| `onReceiveMessage`   | `(message: string) => any`                                                                                   | -             | No                                          | A callback function called when a message is received.                             |
| `onWaiting`          | `(clientMessage: string) => any`                                                                             | -             | No                                          | A callback function called when the chatbot is waiting for a response.             |

## Customization

You can override the style of the chatbot by overriding the CSS rules with classes starting with `asana-chatbot`. This allows you to customize the appearance of the chatbot to match your website's design. Here's an example of overriding CSS styles:

## Development

To run the demo locally and make changes to the module:

1. To run the local static server:

```
npm run build
```

2. to build the app; The built module will be located in the `dist/` directory.

```
npm run build
```

3. to build the app, start the local static server and watch modifications in the source code:

```
npm run watch-dev
```
