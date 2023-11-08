// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import { Configuration, EnvironmentPlugin, WebpackPluginInstance } from "webpack";
import type {
  ConnectHistoryApiFallbackOptions,
  Configuration as WebpackDevServerConfiguration,
} from "webpack-dev-server";

import type { WebpackArgv } from "@foxglove/studio-base/WebpackArgv";
import { makeConfig } from "@foxglove/studio-base/webpack";
import * as palette from "@foxglove/theme/src/palette";

export interface WebpackConfiguration extends Configuration {
  devServer?: WebpackDevServerConfiguration;
}

export type ConfigParams = {
  /** Directory to find `entrypoint` and `tsconfig.json`. */
  contextPath: string;
  entrypoint: string;
  outputPath: string;
  publicPath?: string;
  /** Source map (`devtool`) setting to use for production builds */
  prodSourceMap: string | false;
  /** Set the app version information */
  version: string;
  /** Needs to be overridden for react-router */
  historyApiFallback?: ConnectHistoryApiFallbackOptions;
  /** Customizations to index.html */
  indexHtmlOptions?: Partial<HtmlWebpackPlugin.Options>;
};

export const devServerConfig = (params: ConfigParams): WebpackConfiguration => ({
  // Use empty entry to avoid webpack default fallback to /src
  entry: {},

  // Output path must be specified here for HtmlWebpackPlugin within render config to work
  output: {
    publicPath: params.publicPath ?? "",
    path: params.outputPath,
  },

  devServer: {
    static: {
      directory: params.outputPath,
    },
    historyApiFallback: params.historyApiFallback,
    hot: true,
    // The problem and solution are described at <https://github.com/webpack/webpack-dev-server/issues/1604>.
    // When running in dev mode two errors are logged to the dev console:
    //  "Invalid Host/Origin header"
    //  "[WDS] Disconnected!"
    // Since we are only connecting to localhost, DNS rebinding attacks are not a concern during dev
    allowedHosts: "all",
    client: {
      webSocketURL: process.env.USE_LOCAL_DATAWARE_TOOLS
        ? "wss://dataware-tools.local/scene-viewer/ws"
        : "auto://0.0.0.0:0/ws",
    },
  },

  plugins: [new CleanWebpackPlugin()],
});

export const mainConfig =
  (params: ConfigParams) =>
  (env: unknown, argv: WebpackArgv): Configuration => {
    const isDev = argv.mode === "development";
    const isServe = argv.env?.WEBPACK_SERVE ?? false;

    const allowUnusedVariables = isDev;

    const plugins: WebpackPluginInstance[] = [];

    if (isServe) {
      plugins.push(new ReactRefreshPlugin());
    }

    const appWebpackConfig = makeConfig(env, argv, {
      allowUnusedVariables,
      version: params.version,
    });

    const config: Configuration = {
      name: "main",

      ...appWebpackConfig,

      target: "web",
      context: params.contextPath,
      entry: params.entrypoint,
      devtool: isDev ? "eval-cheap-module-source-map" : params.prodSourceMap,

      output: {
        publicPath: params.publicPath ?? "auto",

        // Output filenames should include content hashes in order to cache bust when new versions are available
        filename: isDev ? "[name].js" : "[name].[contenthash].js",

        path: params.outputPath,
      },

      plugins: [
        ...plugins,
        ...(appWebpackConfig.plugins ?? []),
        new EnvironmentPlugin({
          DATAWARE_TOOLS_BACKEND_API_PREFIX: "/api/latest",
          DATAWARE_TOOLS_AUTH_CONFIG_DOMAIN: "dataware-tools.us.auth0.com",
          DATAWARE_TOOLS_AUTH_CONFIG_CLIENT_ID: "ETb1RhJEbtXlFgWtaHzl5kPCkaYqhTVl",
          DATAWARE_TOOLS_AUTH_CONFIG_API_URL: "https://demo.dataware-tools.com/",
        }),
        new CopyPlugin({
          patterns: [{ from: path.resolve(__dirname, "..", "public") }],
        }),
        new HtmlWebpackPlugin({
          templateContent: ({ htmlWebpackPlugin }) => `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="apple-mobile-web-app-capable" content="yes">
      ${htmlWebpackPlugin.options.foxgloveExtraHeadTags}
      <style type="text/css" id="loading-styles">
        body {
          margin: 0;
        }
        #root {
          height: 100vh;
          background-color: ${palette.light.background?.default};
          color: ${palette.light.text?.primary};
        }
        @media (prefers-color-scheme: dark) {
          #root {
            background-color: ${palette.dark.background?.default}};
            color: ${palette.dark.text?.primary};
          }
        }
      </style>
    </head>
    <script>
      global = globalThis;
      globalThis.FOXGLOVE_STUDIO_DEFAULT_LAYOUT = [/*FOXGLOVE_STUDIO_DEFAULT_LAYOUT_PLACEHOLDER*/][0];
    </script>
    <body>
      <div id="root"></div>
    </body>
  </html>
  `,
          foxgloveExtraHeadTags: `
            <title>Foxglove Studio</title>
            <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png" />
          `,
          ...params.indexHtmlOptions,
        }),
      ],
    };

    return config;
  };
