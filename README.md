# dd-cli

A CLI tool for working with datadog. 

## setup

```sh
git clone git@github.com:nimbushq/dd-cli.git
cd dd-cli
yarn && yarn build
npm link
```

## logs

```sh
nimbus logs

Search across dd logs. The following environmental variables need to be set in
order to run this command: DD_SITE, DD_API_KEY, DD_APP_KEY

Options:
      --version                             Show version number        [boolean]
      --help                                Show help                  [boolean]
  -q, --query                               dd log query     [string] [required]
  -f, --from                                time in the following format:
                                            2024-02-14T11:35:00-08:00
                                                             [string] [required]
      --to, --t, desc: "time in the
      following format:
      2024-02-14T11:35:00-08:00"                             [string] [required]
  -i, --indexes                             log indexes to search
                                                     [array] [default: ["main"]]
  -d, --disaggregate                        disaggregate aggregated logs
                                                                       [boolean]
```

## Usage

Replace env variables with your org specific values
```sh
# regular query
env DD_SITE="***" DD_API_KEY="***" DD_APP_KEY="***" dd-cli logs -q "service:elb " -f "2024-02-14T11:35:00-08:00" -t "2024-02-14T11:38:00-08:00"

# query with log disaggregation
env DD_SITE="***" DD_API_KEY="***" DD_APP_KEY="***" dd-cli logs -q "service:elb " -f "2024-02-14T11:35:00-08:00" -t "2024-02-14T11:38:00-08:00" -d
```
