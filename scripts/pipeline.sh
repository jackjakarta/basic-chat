#!/bin/sh

pnpm format:check && pnpm lint && pnpm types && pnpm test && pnpm build
