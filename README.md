# What is Socrates?

## _A Simple Automation Server_

[![@coreui angular](https://img.shields.io/badge/@coreui%20-angular-lightgrey.svg?style=flat-square)](https://github.com/coreui/angular)

[Socrates](./#a-simple-automation-server) is a simple automation server, inspired by Jenkins. It can run tasks in any code language and present them in a friendly dashboard to non-technical users.

![Overview](overview.png)

## Quickstart

_For Evaluation and Testing:_

1. Download the `docker-compose.yaml` file from the root of the repository.
2. Run `docker-compose up` and wait until all components are healthy.

## Features

* Define [Parameterized](fundamentals/parameters/) [Blocks](fundamentals/projects.md) of code in any language to be run in Docker.
* Define Static and [Dynamic](fundamentals/parameters/dynamic.md) [parameters](fundamentals/parameters/) to be used by all Blocks.
* Create [Instances](fundamentals/instances/) of code that can be run individually.
* Create [Steps](fundamentals/flows/step-flows.md) and [DAG](fundamentals/flows/dag-flows.md) [Flows](fundamentals/flows/) using Instances of code.
* Save [Artifacts](fundamentals/instances/artifacts.md) and Outputs, managed by Minio S3.
* [Schedule](fundamentals/scheduler.md) any component and view it in a timeline.
* Connect a [Github](configuration/settings/github.md) repository with or without a Webhook, automatically update all the code in the server.
* Manage a friendly [Developer Portal](use-cases/user-portal.md), give your jobs custom names and folders.
* Can be run on [Docker or on Kubernetes](guides/creating-your-first-project.md)

## Components

Socrates's main components are the basic terms that define how to work with the server.

| Component                                      | Description                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Block](fundamentals/projects.md)              | A Block is a component made of a Code in a specific Language. It might have [parameters](fundamentals/parameters/), defaults, and a Pre-Code in `Shell` to execute before the main. It may also be directly attached to a file in [Github](configuration/settings/github.md).                                                                                                               |
| [Instance](fundamentals/instances/)            | An Instance is attached to a [Block](fundamentals/projects.md). It is essentially a [Parameterized](fundamentals/parameters/) [Block](fundamentals/projects.md), with its own execution History. Multiple Instance can exist for the same [Block](fundamentals/projects.md). It can be run individually, inside a [Flow](fundamentals/flows/) or be [scheduled](fundamentals/scheduler.md). |
| [Steps Flow](fundamentals/flows/step-flows.md) | Steps Flow is a pipeline of one or more [Instances](fundamentals/instances/) arranged in Steps. They share ENV Variables ([parameters](fundamentals/parameters/)) and Outputs to the next Steps. It has its own execution history and can be drilled down to individual Instances.                                                                                                          |
| [DAG Flow](fundamentals/flows/dag-flows.md)    | DAG Flow is a pipeline of one or more [Instances](fundamentals/instances/) arranged in a Graph. They share ENV Variables ([parameters](fundamentals/parameters/)), and pass Outputs to the next Nodes in the Branch. It has its own execution history and can be drilled down to individual [Instances](fundamentals/instances/).                                                           |
| [Parameters](fundamentals/parameters/)         | Each [Block](fundamentals/projects.md) and its [Instance](fundamentals/instances/) have "parameters" which always include defaults. These are basically translated as Strings (Environment Variables) inside the execution of any code language in its virtual machine. Parameters can also be [Dynamic](fundamentals/parameters/dynamic.md).                                               |

## License

Apache 2.0
