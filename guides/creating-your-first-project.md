---
description: Socrates requires either Docker or Kubernetes to run.
---

# 💾 Installation

#### Docker

The Docker method is intended for development or evaluation and not for Production as it is not easily scalable.

`docker-compose.yaml` file available in root.

```
docker-compose up
```

#### Kubernetes

Helm Chart available in `chart/`

```
helm install -f values.yaml socrates .
```
