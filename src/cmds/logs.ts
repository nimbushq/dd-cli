import { client, v2 } from "@datadog/datadog-api-client";
import { createEnv } from "@t3-oss/env-core";
import _ from "lodash";
import { z } from "zod";

export type LogCmdArgs = {
  query: string,
  from: string,
  to: string,
  indexes: string[]
  disaggregate: boolean;
}
interface NimDataEntry {
  timestamp: string;
}

interface DataStructure {
  attributes: {
    attributes: {
      nimdata: NimDataEntry[];
    }
  }
}
// Function to convert timestamp to Unix time (in milliseconds)
const toUnixTime = (timestamp: string): number => {
  return new Date(timestamp).getTime();
};

export class LogsCommand {
  async execute(opts: LogCmdArgs) {

    // error if any input is missing
    try {
      createEnv({
        server: {
          DD_SITE: z.string(),
          DD_API_KEY: z.string(),
          DD_APP_KEY: z.string(),
        },
        runtimeEnv: process.env,
      });

    } catch (e) {
      console.log("error: ")
      return;
    }
    const resp = await searchLogs(opts)
    if (opts.disaggregate) {
      return disaggregateLogs(resp)
    }
    return JSON.stringify(resp, null, 2)

  }
}

function searchLogs(opts: { query: string, from: string, to: string, indexes?: string[] }) {
  const copts = _.defaults(opts, ["main"])
  // const outputPath = "/tmp/output.raw.json"
  const configuration = client.createConfiguration();
  const apiInstance = new v2.LogsApi(configuration);
  const params: v2.LogsApiListLogsRequest = {
    body: {
      filter: {
        query: copts.query,
        indexes: copts.indexes,
        from: copts.from,
        to: copts.to,
      },
      sort: "timestamp",
      page: {
        limit: 500,
      },
    },
  };
  return apiInstance
    .listLogs(params)
    .then((data: v2.LogsListResponse) => {
      console.log(`found ${data.data?.length || 0} results `) // Add nullish coalescing operator
      // fs.writeJSONSync(outputPath, data, { spaces: 2 })
      return data;
    })
    .catch((error: any) => console.error(error));
}

function disaggregateLogs(jsonDataRaw: any) {
  const jsonDataClean: DataStructure[] = _.filter(jsonDataRaw.data, (entry) => {
    // console.log(entry)
    return entry !== undefined && _.has(entry.attributes.attributes, 'nimdata')
  })
  const jsonNimData = _.flatMap(jsonDataClean, (entry) => entry.attributes.attributes.nimdata);
  // Extract nimdata and sort by timestamp converted to Unix time
  const sortedNimData = jsonNimData.map(entry => ({
    ...entry,
    unixTimestamp: toUnixTime(entry.timestamp) // Convert and append Unix time
  }))
    .sort((a, b) => a.unixTimestamp - b.unixTimestamp) // Sort by Unix time


  console.log(`found ${sortedNimData.length} disaggregated entries`)
  return sortedNimData;
}
