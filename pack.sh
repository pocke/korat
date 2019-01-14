#!/bin/bash

# Usage: ./pack.sh [build|publish]

set -xe

SUBCOMMAND="$1"
KORAT_GO_VERSION="v0.0.4"

if [ "$SUBCOMMAND" != "build" -a "$SUBCOMMAND" != "publish" ]; then
  echo "Usage: ./pack.sh [build|publish]"
  exit 1
fi

wget "https://github.com/pocke/korat-go/releases/download/${KORAT_GO_VERSION}/korat-go-linux-amd64.tar.gz"
wget "https://github.com/pocke/korat-go/releases/download/${KORAT_GO_VERSION}/korat-go-darwin-10.6-amd64.tar.gz"
wget "https://github.com/pocke/korat-go/releases/download/${KORAT_GO_VERSION}/korat-go-windows-4.0-amd64.zip"

tar xvzf korat-go-linux-amd64.tar.gz
rm korat-go-linux-amd64.tar.gz
mv korat-go korat-go-linux

tar xvzf korat-go-darwin-10.6-amd64.tar.gz
rm korat-go-darwin-10.6-amd64.tar.gz
mv korat-go korat-go-mac

unzip korat-go-windows-4.0-amd64.zip
rm korat-go-windows-4.0-amd64.zip
mv korat-go.exe korat-go-windows

rm -rf dist/production
yarn run build:production:renderer
yarn run build:production:electron

if [ "$SUBCOMMAND" == "build" ]; then
  yarn run dist
elif [ "$SUBCOMMAND" == "publish" ]; then
  yarn run dist
fi
