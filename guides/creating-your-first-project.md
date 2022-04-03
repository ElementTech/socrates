---
description: Socrates requires either Docker or Kubernetes to run.
---

# 💾 Installation

#### Docker

`docker-compose.yaml` file available in root.

```
docker-compose up
```

#### Kubernetes

Helm Chart available in `chart/`

```
helm install -f values.yaml socrates .
```
