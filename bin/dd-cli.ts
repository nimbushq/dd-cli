#!/usr/bin/env node

import * as yargs from "yargs";
import { LogCmdArgs, LogsCommand } from "../src/cmds";

yargs
  .scriptName("nimbus")
  .usage('$0 <cmd> [args]')
  .help()
  .command<LogCmdArgs>('logs', 'Search across dd logs. The following environmental variables need to be set in order to run this command: DD_SITE, DD_API_KEY, DD_APP_KEY', (yargs) => {
    yargs.options(
      {
        query: { type: 'string', demandOption: true, alias: 'q', desc: "dd log query" },
        from: { type: 'string', demandOption: true, alias: 'f', desc: "time in the following format: 2024-02-14T11:35:00-08:00" },
        to: { type: 'string', demandOption: true, alias: 't, desc: "time in the following format: 2024-02-14T11:35:00-08:00"' },
        indexes: { type: 'array', demandOption: false, alias: 'i', default: ["main"], desc: "log indexes to search"},
        disaggregate: { type: 'boolean', demandOption: false, alias: 'd', desc: "disaggregate aggregated logs" }
      });
  },
    async function (argv) {
      const resp = await new LogsCommand().execute(argv)
      if (resp !== undefined) console.log(resp)
    }).argv