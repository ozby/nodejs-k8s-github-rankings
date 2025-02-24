# challenge

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


