#!/usr/bin/env node

import * as yargs from "yargs";
import { LogCmdArgs, LogsCommand } from "./cmds";

yargs
  .scriptName("nimbus")
  .usage('$0 <cmd> [args]')
  .help()
  .command<LogCmdArgs>('logs [wsName]', 'search across dd logs', (yargs) => {
    yargs.options(
      {
        query: { type: 'string', demandOption: true, alias: 'q' },
        from: { type: 'string', demandOption: true, alias: 'f' },
        to: { type: 'string', demandOption: true, alias: 't' },
        indexes: { type: 'array', demandOption: false, alias: 'i' },
        disaggregate: { type: 'boolean', demandOption: false, alias: 'd' }
      });
  },
    async function (argv) {
      const resp = await new LogsCommand().execute(argv)
      if (resp !== undefined) console.log(resp)
    }).argv