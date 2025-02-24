# challenge

### Add the app to your ArgoCD or install as helm chart
```
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: challenge
  namespace: argo-cd
spec:
    project: default
    source:
        repo-url: 'https://github.com/ozby/challenge-202502.git'
        path: infra
        targetRevision: HEAD
        helm:
            valueFiles:
                - values.yaml
    destination:
        server: 'https://kubernetes.production.svc'
        namespace: challenge
    syncPolicy:
        automated:
        prune: true
        syncOptions:
        - CreateNamespace=true
```


