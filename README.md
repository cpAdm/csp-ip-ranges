# CSP IP Ranges

[![Daily CSP IP Ranges Fetch](https://github.com/cpAdm/csp-ip-ranges/actions/workflows/fetch-csp-ranges.yml/badge.svg)](https://github.com/cpAdm/csp-ip-ranges/actions/workflows/fetch-csp-ranges.yml)

Aggregated cloud provider CIDR ranges from public provider data sources.

## Supported Providers

[//]: # "TODO Check for all providers if we retrieve all kind of service IP's"

| Provider              | Key in Output (`csp`) | Public Source                                                                        |
| --------------------- | --------------------- | ------------------------------------------------------------------------------------ |
| Amazon Web Services   | `AWS`                 | https://docs.aws.amazon.com/vpc/latest/userguide/aws-ip-ranges.html                  |
| Microsoft Azure       | `azure`               | https://www.microsoft.com/en-us/download/details.aspx?id=56519                       |
| Google Cloud Platform | `GCP`                 | https://support.google.com/a/answer/10026322                                         |
| Cloudflare            | `cloudflare`          | https://www.cloudflare.com/ips/                                                      |
| DigitalOcean          | `digital_ocean`       | https://ideas.digitalocean.com/documentation/p/list-of-digital-ocean-ips-cidrs       |
| IBM Cloud             | `IBM`                 | https://cloud.ibm.com/docs/security-groups?topic=security-groups-ibm-cloud-ip-ranges |
| Oracle Cloud          | `oracle_cloud`        | https://docs.oracle.com/en-us/iaas/Content/General/Concepts/addressranges.htm        |
| Vultr                 | `vultr`               | https://docs.vultr.com/vultr-ip-space                                                |

## Not Currently Implemented

The following providers are not currently included:

- Alibaba Cloud (no single official published global range feed was identified)
- OVH Cloud (ranges are distributed across documentation pages):
  https://help.ovhcloud.com/csm/en-gb-search?id=kb_search&query=List%20of%20IP&language=en
- Tencent Cloud
- Rackspace
- Apache CloudStack-based providers
- Huawei Cloud
- ...

If you have reliable public range feeds for any of these, contributions are welcome.

## Data

All data is saved in JSON format in the `data` directory. Check the files contains for its format or see its JSON Schema
in `csp.schema.json`.

## Quick Start

Install dependencies:

```bash
npm install
```

Fetch all provider ranges and write a combined file to `data/YYYY-MM-DD.json`:

```bash
npm run fetch
```

Type-check locally:

```bash
npm run ts-check
```

## Versioning and Stability

This project follows Semantic Versioning, but it is currently in the `0.x` phase. While the major version is `0`,
breaking changes can happen in minor releases.
