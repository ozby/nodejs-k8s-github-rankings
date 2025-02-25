# Fun Project
Github Rankings fetcher with NodeJS (nestjs) and Kubernetes with dev environment using Tilt

## CI/CD
### Handled by GitHub Actions
tests helm chart, nestjs code as well as k8s cron job by creating a single node k8s (kind) in GH actions. 

## Run locally in development mode
```
Requires a running local kubernetes cluster. Activate from Docker Desktop > settings > Kubernetes
# instal tilt if not already installed: https://tilt.dev/
tilt up

you can trigger the importing cron job manually by running: trigger-import in Tilt UI
```

## Production deployment:
### Add the app to your ArgoCD or install as helm chart
```
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: challenge-202502
spec:
  destination:
    namespace: challenge-202502
    server: https://kubernetes.default.svc
  source:
    path: infra
    repoURL: https://github.com/ozby/challenge-202502.git
    targetRevision: HEAD
    helm:
      valueFiles:
        - values.yaml
  sources: []
  project: default
  syncPolicy:
      automated:
      prune: true
      syncOptions:
      - CreateNamespace=true
```


